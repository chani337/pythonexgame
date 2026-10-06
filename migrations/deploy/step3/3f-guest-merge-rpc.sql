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
