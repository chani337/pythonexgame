-- =====================================================================
-- 001 — Ranking integrity : ROLLBACK
-- =====================================================================
-- Returns the database to its pre-001 behaviour. Run top to bottom.
--
-- What this does NOT undo:
--   * Rows moved to public.quarantined_solved_problems. They are left in
--     place deliberately. STEP 4 below shows how to put them back.
--   * profiles.streak / solved_count / last_solved_date values, which have
--     been recomputed from real data. The old client-reported values are
--     not recoverable -- but the recomputed ones are the correct ones, so
--     there is nothing to restore.
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


-- STEP 3 — drop the FK so invented problem_ids are accepted again
ALTER TABLE public.user_solved_problems
  DROP CONSTRAINT IF EXISTS user_solved_problems_problem_id_fkey;
ALTER TABLE public.user_review_problems
  DROP CONSTRAINT IF EXISTS user_review_problems_problem_id_fkey;


-- STEP 4 — (optional) replay quarantined rows
-- Only do this if STEP 0's pre-flight showed the rows were real progress
-- against renamed problems, not manipulation. Map the old ids first.
--
-- INSERT INTO public.user_solved_problems (id, user_id, problem_id, solved_at)
-- SELECT id, user_id, problem_id, solved_at
-- FROM public.quarantined_solved_problems
-- ON CONFLICT (user_id, problem_id) DO NOTHING;


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


-- STEP 6 — (optional) drop the new tables
-- Leaving them costs nothing and keeps the quarantine audit trail.
--
-- DROP TABLE IF EXISTS public.quarantined_solved_problems;
-- DROP TABLE IF EXISTS public.problems;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS hidden;
