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
