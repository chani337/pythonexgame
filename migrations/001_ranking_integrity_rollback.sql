-- =====================================================================
-- 001 — Ranking integrity : ROLLBACK
-- =====================================================================
-- Returns the database to its pre-001 behaviour. Run top to bottom.
--
-- 001 deletes nothing, so there is no data to put back. The only thing this
-- cannot undo is the recomputed profiles.streak / solved_count /
-- last_solved_date -- the old client-reported values are gone. Those were the
-- untrusted ones the migration existed to replace, and the recomputed values
-- are derived from the solve rows, which are untouched.
-- =====================================================================


-- STEP 1 — restore the open SELECT policy and blanket grants
DROP POLICY IF EXISTS "solved_select_own" ON public.user_solved_problems;
CREATE POLICY "solved_select_public" ON public.user_solved_problems
  FOR SELECT USING (true);

CREATE POLICY "solved_update_own" ON public.user_solved_problems
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

GRANT ALL ON public.profiles                TO anon, authenticated, service_role, postgres;
GRANT ALL ON public.user_solved_problems    TO anon, authenticated, service_role, postgres;
GRANT ALL ON public.user_read_chapters      TO anon, authenticated, service_role, postgres;
GRANT ALL ON public.user_review_problems    TO anon, authenticated, service_role, postgres;
GRANT ALL ON public.user_quiz_answers       TO anon, authenticated, service_role, postgres;
GRANT ALL ON public.board_posts             TO anon, authenticated, service_role, postgres;


-- STEP 2 — drop the triggers so the client can write stats again
DROP TRIGGER IF EXISTS solved_rate_limit            ON public.user_solved_problems;
DROP TRIGGER IF EXISTS solved_refresh_stats_insert  ON public.user_solved_problems;
DROP TRIGGER IF EXISTS solved_refresh_stats_delete  ON public.user_solved_problems;
DROP TRIGGER IF EXISTS profiles_protect_stats       ON public.profiles;

DROP FUNCTION IF EXISTS public.enforce_solve_rate_limit();
DROP FUNCTION IF EXISTS public.refresh_solver_stats();
DROP FUNCTION IF EXISTS public.protect_profile_stats();
DROP FUNCTION IF EXISTS public.merge_guest_progress(TEXT[]);
DROP FUNCTION IF EXISTS public.calculate_streak(UUID);


-- STEP 3 — drop the problem_id validation so any id is accepted again
DROP TRIGGER IF EXISTS solved_known_problem ON public.user_solved_problems;
DROP TRIGGER IF EXISTS review_known_problem ON public.user_review_problems;
DROP FUNCTION IF EXISTS public.enforce_known_problem_id();

-- There is no quarantine to replay: STEP 3 never removed a row. Rows with an
-- unknown problem_id are still in user_solved_problems exactly as they were,
-- and after this rollback they count toward solved_count again (the old
-- behaviour).


-- STEP 5 — restore the previous views
CREATE OR REPLACE VIEW public.leaderboard_public AS
  SELECT
    p.id,
    p.display_name,
    p.streak,
    COALESCE(sc.solved_count, 0)::int AS solved_count
  FROM public.profiles p
  LEFT JOIN (
    SELECT user_id, COUNT(*) AS solved_count
    FROM public.user_solved_problems
    GROUP BY user_id
  ) sc ON sc.user_id = p.id;

GRANT SELECT ON public.leaderboard_public TO anon, authenticated;

DROP VIEW IF EXISTS public.recent_activity_public;
DROP VIEW IF EXISTS public.language_leaderboard_public;
DROP VIEW IF EXISTS public.weekly_leaderboard_public;


-- STEP 6 — (optional) drop the new objects
-- Leaving them costs nothing. public.problems is just a mirror of
-- src/data/problems.ts and `hidden` defaults to false.
--
-- DROP VIEW  IF EXISTS public.language_leaderboard_public;
-- DROP VIEW  IF EXISTS public.weekly_leaderboard_public;
-- DROP TABLE IF EXISTS public.problems;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS hidden;
