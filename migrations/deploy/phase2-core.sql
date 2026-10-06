-- =====================================================================
-- PyQuests 배포 2단계 — 무결성 핵심 (001 STEP 2~6, 8)
-- =====================================================================
-- Supabase 대시보드 → SQL Editor 에 이 파일 전체를 붙여넣고 실행하세요.
-- !! problems 가 377개인 것을 먼저 확인. STEP 3 의 "users > 1" 리포트를 꼭 읽으세요.
--
-- 001 과 002 는 어떤 행도 삭제하지 않습니다 (DELETE 문 0개).
-- 상세: docs/migrations/001-ranking-integrity.md
-- =====================================================================

-- ---------------------------------------------------------------------
-- STEP 2 — profiles: hidden flag + server-owned stat columns
-- ---------------------------------------------------------------------

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.hidden IS
  'Excluded from leaderboard_public and recent_activity_public. Use for test/admin accounts and confirmed manipulation, replacing the client-side EXCLUDED_LEADERBOARD_IDS list.';
COMMENT ON COLUMN public.profiles.streak IS
  'Server-derived. Maintained by refresh_solver_stats(); client writes are ignored.';
COMMENT ON COLUMN public.profiles.last_solved_date IS
  'Server-derived (Asia/Seoul, YYYY-MM-DD). Maintained by refresh_solver_stats(); client writes are ignored.';
COMMENT ON COLUMN public.profiles.solved_count IS
  'Server-derived. Maintained by refresh_solver_stats(); client writes are ignored.';

-- Reject client writes to the derived columns by silently restoring the old
-- values rather than raising. Erroring would break the existing signup and
-- fetchProfile upserts, which send `streak: 0` as part of a wider payload --
-- this way an outdated client keeps working while its stat values stop
-- mattering. Column-level REVOKE UPDATE was the alternative; it fails those
-- upserts with a 403 instead, which is a worse failure mode mid-rollout.
CREATE OR REPLACE FUNCTION public.protect_profile_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only the client roles are untrusted. PostgREST sets the role per request
  -- (anon / authenticated / service_role) and the Supabase SQL editor runs as
  -- postgres, so an administrator fixing a row by hand and the service_role
  -- key both still work. Without this the trigger also silently swallowed
  -- `UPDATE profiles SET hidden = true` from the SQL editor -- which is
  -- exactly how an account gets hidden.
  IF current_user NOT IN ('anon', 'authenticated') THEN
    RETURN NEW;
  END IF;

  -- refresh_solver_stats() sets this before its own UPDATE.
  IF COALESCE(current_setting('pyquests.trusted_stats_write', true), 'off') = 'on' THEN
    RETURN NEW;
  END IF;

  NEW.streak           := OLD.streak;
  NEW.last_solved_date := OLD.last_solved_date;
  NEW.solved_count     := OLD.solved_count;
  NEW.hidden           := OLD.hidden;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_protect_stats ON public.profiles;
CREATE TRIGGER profiles_protect_stats
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_stats();


-- ---------------------------------------------------------------------

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

-- ---------------------------------------------------------------------
-- STEP 4 — Server-computed streak / last_solved_date / solved_count
-- ---------------------------------------------------------------------

-- Consecutive days (Asia/Seoul) with at least one solve, counted back from
-- the most recent solve day. Returns 0 once that day is older than
-- yesterday; "yesterday" rather than "today" so the streak does not appear
-- to reset every morning before the first solve of the day.
CREATE OR REPLACE FUNCTION public.calculate_streak(p_user_id UUID)
RETURNS INT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  WITH today AS (
    SELECT (NOW() AT TIME ZONE 'Asia/Seoul')::date AS d
  ),
  solve_days AS (
    SELECT DISTINCT (s.solved_at AT TIME ZONE 'Asia/Seoul')::date AS d
    FROM public.user_solved_problems s
    -- Only solves of real problems build a streak, so a day fabricated with
    -- invented ids contributes nothing.
    JOIN public.problems p ON p.id = s.problem_id
    WHERE s.user_id = p_user_id
      AND (s.solved_at AT TIME ZONE 'Asia/Seoul')::date <= (SELECT d FROM today)
  ),
  ranked AS (
    SELECT d, ROW_NUMBER() OVER (ORDER BY d DESC) AS rn FROM solve_days
  ),
  newest AS (
    SELECT MAX(d) AS last_day FROM solve_days
  )
  -- Days are distinct and descending, so rn increases by exactly 1 while an
  -- unbroken run's dates fall by exactly 1. The equality below therefore
  -- holds for precisely the contiguous run ending at last_day, and fails for
  -- every row after the first gap.
  SELECT COALESCE((
    SELECT COUNT(*)::int
    FROM ranked r, newest n, today t
    WHERE n.last_day >= t.d - 1
      -- rn is bigint (ROW_NUMBER); date arithmetic only has a date - integer
      -- operator, so the offset has to be cast explicitly.
      AND r.d = n.last_day - (r.rn - 1)::int
  ), 0);
$$;

COMMENT ON FUNCTION public.calculate_streak(UUID) IS
  'Current consecutive-day solve streak in Asia/Seoul, derived from user_solved_problems.';

-- Recomputes the derived profile columns for every user touched by the
-- statement. Statement-level with a transition table rather than FOR EACH
-- ROW so a bulk merge (merge_guest_progress) costs one recompute per user
-- instead of one per inserted row.
CREATE OR REPLACE FUNCTION public.refresh_solver_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  affected UUID[];
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT ARRAY_AGG(DISTINCT user_id) INTO affected FROM inserted;
  ELSE
    SELECT ARRAY_AGG(DISTINCT user_id) INTO affected FROM deleted;
  END IF;

  IF affected IS NULL THEN
    RETURN NULL;
  END IF;

  PERFORM set_config('pyquests.trusted_stats_write', 'on', true);

  UPDATE public.profiles p
  SET streak           = public.calculate_streak(p.id),
      solved_count     = COALESCE(agg.cnt, 0),
      last_solved_date = agg.last_day,
      updated_at       = NOW()
  FROM (
    SELECT u.id,
           -- Joined to public.problems so a leftover invented id inflates
           -- nothing. STEP 3 keeps those rows rather than deleting them.
           (SELECT COUNT(*) FROM public.user_solved_problems s
              JOIN public.problems p2 ON p2.id = s.problem_id
            WHERE s.user_id = u.id) AS cnt,
           (SELECT TO_CHAR(MAX(s.solved_at AT TIME ZONE 'Asia/Seoul'), 'YYYY-MM-DD')
              FROM public.user_solved_problems s
              JOIN public.problems p2 ON p2.id = s.problem_id
            WHERE s.user_id = u.id) AS last_day
    FROM UNNEST(affected) AS u(id)
  ) agg
  WHERE p.id = agg.id;

  PERFORM set_config('pyquests.trusted_stats_write', 'off', true);
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS solved_refresh_stats_insert ON public.user_solved_problems;
CREATE TRIGGER solved_refresh_stats_insert
  AFTER INSERT ON public.user_solved_problems
  REFERENCING NEW TABLE AS inserted
  FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_solver_stats();

DROP TRIGGER IF EXISTS solved_refresh_stats_delete ON public.user_solved_problems;
CREATE TRIGGER solved_refresh_stats_delete
  AFTER DELETE ON public.user_solved_problems
  REFERENCING OLD TABLE AS deleted
  FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_solver_stats();

-- Backfill every existing profile from its real solve rows.
DO $$
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
                          WHERE s.user_id = p.id);

  PERFORM set_config('pyquests.trusted_stats_write', 'off', true);
END
$$;


-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- STEP 5 — Insert rate limit
-- ---------------------------------------------------------------------
-- Secondary defence. The FK in STEP 3 already caps the reachable total, so
-- this is about stopping write-flood abuse of the database rather than
-- stopping rank inflation.
--
-- 30/minute = one solve every 2 seconds sustained. The fastest legitimate
-- pattern is a student clicking through quiz/fill problems they already
-- know, which measures at roughly 4-6 seconds each including the result
-- screen, so 30 leaves better than 2x headroom. Bulk merges go through
-- merge_guest_progress(), which sets the bypass flag below.

CREATE OR REPLACE FUNCTION public.enforce_solve_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  recent INT;
  max_per_minute CONSTANT INT := 30;
BEGIN
  IF COALESCE(current_setting('pyquests.bulk_merge', true), 'off') = 'on' THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO recent
  FROM public.user_solved_problems
  WHERE user_id = NEW.user_id
    AND solved_at > NOW() - INTERVAL '1 minute';

  IF recent >= max_per_minute THEN
    RAISE EXCEPTION
      'pyquests_rate_limit: more than % solves in one minute', max_per_minute
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS solved_rate_limit ON public.user_solved_problems;
CREATE TRIGGER solved_rate_limit
  BEFORE INSERT ON public.user_solved_problems
  FOR EACH ROW EXECUTE FUNCTION public.enforce_solve_rate_limit();


-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- STEP 6 — Views: exclude hidden accounts, add a public activity feed
-- ---------------------------------------------------------------------

CREATE OR REPLACE VIEW public.leaderboard_public AS
  SELECT
    p.id,
    p.display_name,
    p.streak,
    p.solved_count
  FROM public.profiles p
  WHERE p.hidden = false;

-- solved_count is now a trigger-maintained column, so the GROUP BY subquery
-- that used to live here (added to dodge PostgREST's 1000-row cap when the
-- client counted rows itself) is no longer needed -- one row per profile
-- either way, and no aggregate per refresh.

GRANT SELECT ON public.leaderboard_public TO anon, authenticated;

-- Lets the dashboard activity feed work without granting anon a direct read
-- of every row of user_solved_problems. Replaces two client round-trips
-- (raw rows, then a display_name lookup per row) with one, and hides the
-- user_id entirely -- the feed only ever renders a name and a problem title.
CREATE OR REPLACE VIEW public.recent_activity_public AS
  SELECT
    s.problem_id,
    s.solved_at,
    p.display_name
  FROM public.user_solved_problems s
  JOIN public.problems pr ON pr.id = s.problem_id
  JOIN public.profiles p  ON p.id = s.user_id
  WHERE p.hidden = false
  ORDER BY s.solved_at DESC
  LIMIT 50;

GRANT SELECT ON public.recent_activity_public TO anon, authenticated;

COMMENT ON VIEW public.recent_activity_public IS
  'Last 50 solves with display_name only, no user_id. Exists so user_solved_problems does not need a public SELECT policy.';

-- Dashboard's per-language and weekly ranking tabs used to page through every
-- row of user_solved_problems with .range() and count client-side -- which
-- needed the public SELECT policy that STEP 7 removes, and meant anonymous
-- visitors downloaded the whole table on every tab switch. public.problems
-- (STEP 1) carries `language`, so the join can finally happen server-side.
CREATE OR REPLACE VIEW public.language_leaderboard_public AS
  SELECT
    pr.id,
    pr.display_name,
    pr.streak,
    p.language,
    COUNT(*)::int AS solved_count
  FROM public.user_solved_problems s
  JOIN public.problems p  ON p.id  = s.problem_id
  JOIN public.profiles pr ON pr.id = s.user_id
  WHERE pr.hidden = false
  GROUP BY pr.id, pr.display_name, pr.streak, p.language;

GRANT SELECT ON public.language_leaderboard_public TO anon, authenticated;

-- date_trunc('week') starts weeks on Monday, matching the client's previous
-- "days since Monday" arithmetic. Evaluated in Asia/Seoul so the week rolls
-- over at local midnight rather than UTC.
CREATE OR REPLACE VIEW public.weekly_leaderboard_public AS
  SELECT
    pr.id,
    pr.display_name,
    pr.streak,
    COUNT(*)::int AS solved_count
  FROM public.user_solved_problems s
  JOIN public.problems p  ON p.id = s.problem_id
  JOIN public.profiles pr ON pr.id = s.user_id
  WHERE pr.hidden = false
    AND (s.solved_at AT TIME ZONE 'Asia/Seoul')
        >= date_trunc('week', NOW() AT TIME ZONE 'Asia/Seoul')
  GROUP BY pr.id, pr.display_name, pr.streak;

GRANT SELECT ON public.weekly_leaderboard_public TO anon, authenticated;


-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- STEP 8 — merge_guest_progress RPC (used by backlog item 7)
-- ---------------------------------------------------------------------
-- One call instead of N inserts: filters ids against public.problems, sets
-- the rate-limit bypass, and upserts. Added here because the rate limit in
-- STEP 5 would otherwise reject a legitimate guest-progress merge.

-- Output columns changed (added already_owned_count), which CREATE OR REPLACE
-- cannot do -- drop first.
DROP FUNCTION IF EXISTS public.merge_guest_progress(TEXT[]);

CREATE FUNCTION public.merge_guest_progress(p_problem_ids TEXT[])
RETURNS TABLE (merged_count INT, already_owned_count INT, skipped_count INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  uid           UUID := auth.uid();
  requested     INT  := COALESCE(ARRAY_LENGTH(p_problem_ids, 1), 0);
  valid_ids     TEXT[];
  valid_count   INT;
  inserted_rows INT  := 0;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'merge_guest_progress requires an authenticated session'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF requested = 0 THEN
    RETURN QUERY SELECT 0, 0, 0;
    RETURN;
  END IF;

  -- Bounded so this can't be used as an unlimited write primitive; the real
  -- problem set is in the hundreds, so anything near 1000 isn't a merge.
  IF requested > 1000 THEN
    RAISE EXCEPTION 'merge_guest_progress: too many ids (%)', requested
      USING ERRCODE = 'program_limit_exceeded';
  END IF;

  SELECT ARRAY_AGG(t.pid) INTO valid_ids
  FROM (SELECT DISTINCT UNNEST(p_problem_ids) AS pid) t
  WHERE EXISTS (SELECT 1 FROM public.problems p WHERE p.id = t.pid);

  valid_count := COALESCE(ARRAY_LENGTH(valid_ids, 1), 0);

  IF valid_count > 0 THEN
    PERFORM set_config('pyquests.bulk_merge', 'on', true);

    -- Count rows the INSERT actually added, not the ids that were valid --
    -- re-running a merge must report 0 newly saved, otherwise the client
    -- tells the user "saved N problems" every single login.
    WITH ins AS (
      INSERT INTO public.user_solved_problems (user_id, problem_id)
      SELECT uid, pid FROM UNNEST(valid_ids) AS pid
      ON CONFLICT (user_id, problem_id) DO NOTHING
      RETURNING 1
    )
    SELECT COUNT(*)::int INTO inserted_rows FROM ins;

    PERFORM set_config('pyquests.bulk_merge', 'off', true);
  END IF;

  RETURN QUERY SELECT inserted_rows, valid_count - inserted_rows, requested - valid_count;
END;
$$;

REVOKE ALL ON FUNCTION public.merge_guest_progress(TEXT[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.merge_guest_progress(TEXT[]) TO authenticated;

COMMENT ON FUNCTION public.merge_guest_progress(TEXT[]) IS
  'Merges a guest localStorage solve list into the caller''s account. Filters unknown problem ids, bypasses the per-minute insert limit, and reports rows actually added (not ids supplied) so a repeat login reports 0.';
