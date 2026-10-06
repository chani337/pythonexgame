-- =====================================================================
-- PyQuests 배포 4단계 — 권한 축소 (001 STEP 7)
-- =====================================================================
-- Supabase 대시보드 → SQL Editor 에 이 파일 전체를 붙여넣고 실행하세요.
-- !! 새 클라이언트 배포 후 앱이 정상인 것을 확인한 뒤에만 실행하세요.
--
-- 001 과 002 는 어떤 행도 삭제하지 않습니다 (DELETE 문 0개).
-- 상세: docs/migrations/001-ranking-integrity.md, 002-admin-flag.md
-- =====================================================================

-- ---------------------------------------------------------------------
-- STEP 7 — Narrow GRANTs and the public SELECT policy
-- ---------------------------------------------------------------------
-- !! DO NOT APPLY UNTIL THE NEW CLIENT IS DEPLOYED !!
-- The current client reads user_solved_problems directly for the activity
-- feed, as an anonymous visitor, every 8 seconds. Applying this before the
-- client switches to recent_activity_public silently empties that feed.

-- Replace blanket GRANT ALL with the operations the client actually performs.
REVOKE ALL ON public.profiles                 FROM anon, authenticated;
REVOKE ALL ON public.user_solved_problems     FROM anon, authenticated;
REVOKE ALL ON public.user_read_chapters       FROM anon, authenticated;
REVOKE ALL ON public.user_review_problems     FROM anon, authenticated;
REVOKE ALL ON public.user_quiz_answers        FROM anon, authenticated;
REVOKE ALL ON public.board_posts              FROM anon, authenticated;

-- anon reads nothing directly -- only the two public views, which run with
-- the view owner's privileges and so need no table grant here.
GRANT SELECT, INSERT, UPDATE ON public.profiles             TO authenticated;
GRANT SELECT, INSERT         ON public.user_solved_problems  TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.user_read_chapters    TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.user_review_problems  TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_quiz_answers     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.board_posts   TO authenticated;

GRANT ALL ON public.profiles, public.user_solved_problems, public.user_read_chapters,
             public.user_review_problems, public.user_quiz_answers, public.board_posts
  TO service_role;

-- No DELETE for authenticated on user_solved_problems: nothing in the client
-- un-solves a problem, and withholding it means a compromised session cannot
-- wipe someone's progress. Account deletion goes through the FK cascade from
-- profiles instead.

-- Scope the solved-rows read to the owner. The leaderboard and activity feed
-- both go through views now.
DROP POLICY IF EXISTS "solved_select_public" ON public.user_solved_problems;
DROP POLICY IF EXISTS "solved_select_own" ON public.user_solved_problems;
CREATE POLICY "solved_select_own" ON public.user_solved_problems
  FOR SELECT USING (auth.uid() = user_id);

-- Nothing in the client updates a solved row (insert-only, unique per
-- user+problem), so drop the UPDATE policy rather than leave it open.
DROP POLICY IF EXISTS "solved_update_own" ON public.user_solved_problems;


-- ---------------------------------------------------------------------
