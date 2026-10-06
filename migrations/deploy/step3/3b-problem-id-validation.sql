-- ---------------------------------------------------------------------
-- STEP 3 — Reject unknown problem_ids on new writes (NON-DESTRUCTIVE)
-- ---------------------------------------------------------------------
-- This is the step that closes the exploit, and it deletes nothing.
--
-- A foreign key was the obvious design and it is the wrong one here. A FK
-- cannot be added while rows violate it, so it would force every existing
-- row with an unknown problem_id to be moved or deleted first -- and there is
-- no way to tell from inside the database whether such a row is manipulation
-- or real progress against a problem that was later renamed. Destroying a
-- student's history on that guess is not an acceptable trade for referential
-- purity.
--
-- Instead:
--   * new inserts are validated by a trigger, so invented ids stop working
--   * existing rows stay exactly where they are
--   * solved_count and streak (STEP 4) count only rows that match a known
--     problem, so existing invented ids stop affecting the ranking without
--     being removed
--
-- That last point is what makes this reversible. If a row turns out to be a
-- renamed problem, putting the id back into public.problems makes it count
-- again -- there is nothing to restore from a quarantine table, because
-- nothing was taken away.
--
-- The ceiling is the same as a FK would give: the highest reachable
-- solved_count is the real problem count, identical to someone who finished
-- everything legitimately.

CREATE OR REPLACE FUNCTION public.enforce_known_problem_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.problems p WHERE p.id = NEW.problem_id) THEN
    RAISE EXCEPTION 'pyquests_unknown_problem: "%" 는 존재하지 않는 문제 id 입니다', NEW.problem_id
      USING ERRCODE = 'foreign_key_violation';
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.enforce_known_problem_id() IS
  'Validates problem_id against public.problems on write. Used instead of a FK so existing rows are never deleted.';

DROP TRIGGER IF EXISTS solved_known_problem ON public.user_solved_problems;
CREATE TRIGGER solved_known_problem
  BEFORE INSERT OR UPDATE OF problem_id ON public.user_solved_problems
  FOR EACH ROW EXECUTE FUNCTION public.enforce_known_problem_id();

DROP TRIGGER IF EXISTS review_known_problem ON public.user_review_problems;
CREATE TRIGGER review_known_problem
  BEFORE INSERT OR UPDATE OF problem_id ON public.user_review_problems
  FOR EACH ROW EXECUTE FUNCTION public.enforce_known_problem_id();

-- Lets an admin force a stat recompute without touching a solve row. Needed
-- after fixing a renamed problem id: putting the id back into public.problems
-- makes the rows countable again, but refresh_solver_stats only fires on
-- changes to user_solved_problems, so nothing would recompute on its own.
--
--   SELECT public.recompute_solver_stats();                 -- everyone
--   SELECT public.recompute_solver_stats('<uuid>'::uuid);    -- one account
CREATE OR REPLACE FUNCTION public.recompute_solver_stats(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (user_id UUID, display_name TEXT, solved_count INT, streak INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM set_config('pyquests.trusted_stats_write', 'on', true);

  UPDATE public.profiles p
  SET streak           = public.calculate_streak(p.id),
      solved_count     = COALESCE((SELECT COUNT(*) FROM public.user_solved_problems s
                                     JOIN public.problems p2 ON p2.id = s.problem_id
                                   WHERE s.user_id = p.id), 0),
      last_solved_date = (SELECT TO_CHAR(MAX(s.solved_at AT TIME ZONE 'Asia/Seoul'), 'YYYY-MM-DD')
                            FROM public.user_solved_problems s
                            JOIN public.problems p2 ON p2.id = s.problem_id
                          WHERE s.user_id = p.id),
      updated_at       = NOW()
  WHERE p_user_id IS NULL OR p.id = p_user_id;

  PERFORM set_config('pyquests.trusted_stats_write', 'off', true);

  RETURN QUERY
    SELECT p.id, p.display_name, p.solved_count, p.streak
    FROM public.profiles p
    WHERE p_user_id IS NULL OR p.id = p_user_id
    ORDER BY p.solved_count DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.recompute_solver_stats(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recompute_solver_stats(UUID) TO service_role;

COMMENT ON FUNCTION public.recompute_solver_stats(UUID) IS
  'Admin-only stat recompute. Use after changing public.problems (e.g. restoring a renamed id) since refresh_solver_stats only triggers on solve-row changes.';


-- Report only -- nothing below changes a row.
--
-- Summarised deliberately: with a few thousand invented ids, listing each one
-- buries the handful that matter under pages of noise, and the Supabase SQL
-- editor truncates the result anyway.
SELECT
  'user_solved_problems'                   AS source,
  COUNT(*)                                 AS unknown_rows,
  COUNT(DISTINCT s.problem_id)             AS unknown_ids,
  COUNT(DISTINCT s.user_id)                AS affected_users
FROM public.user_solved_problems s
WHERE NOT EXISTS (SELECT 1 FROM public.problems p WHERE p.id = s.problem_id)
UNION ALL
SELECT
  'user_review_problems',
  COUNT(*), COUNT(DISTINCT r.problem_id), COUNT(DISTINCT r.user_id)
FROM public.user_review_problems r
WHERE NOT EXISTS (SELECT 1 FROM public.problems p WHERE p.id = r.problem_id);

-- The ids worth looking at: ones more than one person solved. A renamed
-- problem shows up here; a one-off invented id does not. If anything in this
-- list looks like a real problem, map it and the progress comes straight back:
--
--   UPDATE public.user_solved_problems SET problem_id = '<new id>'
--   WHERE problem_id = '<old id>';
--   SELECT public.recompute_solver_stats();
SELECT s.problem_id,
       COUNT(*)                  AS rows,
       COUNT(DISTINCT s.user_id) AS users,
       MIN(s.solved_at)::date    AS first_solved,
       MAX(s.solved_at)::date    AS last_solved
FROM public.user_solved_problems s
WHERE NOT EXISTS (SELECT 1 FROM public.problems p WHERE p.id = s.problem_id)
GROUP BY s.problem_id
HAVING COUNT(DISTINCT s.user_id) > 1
ORDER BY users DESC, rows DESC
LIMIT 50;

-- And the single-user ones, capped. Mass-generated ids cluster here.
-- (min() has no uuid overload in Postgres, hence the ::text cast.)
SELECT s.problem_id, COUNT(*) AS rows, MIN(s.user_id::text) AS only_user
FROM public.user_solved_problems s
WHERE NOT EXISTS (SELECT 1 FROM public.problems p WHERE p.id = s.problem_id)
GROUP BY s.problem_id
HAVING COUNT(DISTINCT s.user_id) = 1
ORDER BY s.problem_id
LIMIT 30;


-- ---------------------------------------------------------------------
