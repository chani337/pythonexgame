-- =====================================================================
-- 005 rollback — remove the contest and the Christmas tree view
-- =====================================================================
-- Deletes every contest, class, participant and teacher, and the quiz-miss
-- and answer-view logs. Solves are untouched; only the `merged` flag column
-- goes, and merge_guest_progress() goes back to not setting it.
-- =====================================================================

DROP VIEW IF EXISTS public.daily_solvers_public;

DROP FUNCTION IF EXISTS public.contest_delete(UUID);
DROP FUNCTION IF EXISTS public.contest_regenerate_code(UUID, TEXT);
DROP FUNCTION IF EXISTS public.contest_admin_update_class(UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.contest_update_contest(UUID, TEXT, DATE, DATE);
DROP FUNCTION IF EXISTS public.contest_create(TEXT, DATE, DATE, JSONB, TEXT[], TEXT[]);
DROP FUNCTION IF EXISTS public.contest_admin_list();
DROP FUNCTION IF EXISTS public.contest_require_admin();
DROP FUNCTION IF EXISTS public.contest_rename_participant(UUID, UUID, TEXT);
DROP FUNCTION IF EXISTS public.contest_remove_participant(UUID, UUID);
DROP FUNCTION IF EXISTS public.contest_update_class(UUID, INT, TEXT);
DROP FUNCTION IF EXISTS public.contest_roster(UUID);
DROP FUNCTION IF EXISTS public.contest_join(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.contest_lookup(TEXT);
DROP FUNCTION IF EXISTS public.contest_board();
DROP FUNCTION IF EXISTS public.contest_can_manage(UUID);
DROP FUNCTION IF EXISTS public.contest_scored_solves(UUID);
DROP FUNCTION IF EXISTS public.contest_current_id();
DROP FUNCTION IF EXISTS public.contest_new_code();
DROP FUNCTION IF EXISTS public.contest_normalize_code(TEXT);
DROP FUNCTION IF EXISTS public.kst_today();

DROP TABLE IF EXISTS public.contest_code_attempts;
DROP TABLE IF EXISTS public.contest_teachers;
DROP TABLE IF EXISTS public.contest_participants;
DROP TABLE IF EXISTS public.contest_classes;
DROP TABLE IF EXISTS public.contests;
DROP TABLE IF EXISTS public.user_answer_views;
DROP TABLE IF EXISTS public.user_quiz_misses;

CREATE OR REPLACE FUNCTION public.merge_guest_progress(p_problem_ids TEXT[])
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

ALTER TABLE public.user_solved_problems DROP COLUMN IF EXISTS merged;
