-- =====================================================================
-- PyQuests 배포 1b단계 — 백업 스냅샷
-- =====================================================================
-- 001 과 002 는 어떤 행도 삭제하지 않지만, profiles 의 streak /
-- solved_count / last_solved_date 는 실제 기록으로 "다시 계산"되므로
-- 이전 값이 사라집니다. 그 값들과 사용자 데이터 전체를 먼저 떠 둡니다.
--
-- Supabase 대시보드의 Database → Backups 와 별개로, SQL 한 줄로 되돌릴 수
-- 있는 스냅샷이라 더 빠릅니다. 용량은 원본과 같으니 확인이 끝나면 지우세요.
-- =====================================================================

CREATE SCHEMA IF NOT EXISTS pyquests_backup;

DROP TABLE IF EXISTS pyquests_backup.profiles_before_001;
CREATE TABLE pyquests_backup.profiles_before_001 AS
  SELECT *, NOW() AS backed_up_at FROM public.profiles;

DROP TABLE IF EXISTS pyquests_backup.user_solved_problems_before_001;
CREATE TABLE pyquests_backup.user_solved_problems_before_001 AS
  SELECT *, NOW() AS backed_up_at FROM public.user_solved_problems;

DROP TABLE IF EXISTS pyquests_backup.user_review_problems_before_001;
CREATE TABLE pyquests_backup.user_review_problems_before_001 AS
  SELECT *, NOW() AS backed_up_at FROM public.user_review_problems;

DROP TABLE IF EXISTS pyquests_backup.user_read_chapters_before_001;
CREATE TABLE pyquests_backup.user_read_chapters_before_001 AS
  SELECT *, NOW() AS backed_up_at FROM public.user_read_chapters;

DROP TABLE IF EXISTS pyquests_backup.user_quiz_answers_before_001;
CREATE TABLE pyquests_backup.user_quiz_answers_before_001 AS
  SELECT *, NOW() AS backed_up_at FROM public.user_quiz_answers;

DROP TABLE IF EXISTS pyquests_backup.board_posts_before_001;
CREATE TABLE pyquests_backup.board_posts_before_001 AS
  SELECT *, NOW() AS backed_up_at FROM public.board_posts;

-- 클라이언트는 이 스키마에 접근할 수 없어야 합니다.
REVOKE ALL ON SCHEMA pyquests_backup FROM anon, authenticated;

-- 원본과 행 수가 같은지 확인하세요. 하나라도 다르면 멈추고 다시 실행하세요.
SELECT 'profiles'              AS table_name,
       (SELECT COUNT(*) FROM public.profiles)              AS original,
       (SELECT COUNT(*) FROM pyquests_backup.profiles_before_001) AS backup
UNION ALL SELECT 'user_solved_problems',
       (SELECT COUNT(*) FROM public.user_solved_problems),
       (SELECT COUNT(*) FROM pyquests_backup.user_solved_problems_before_001)
UNION ALL SELECT 'user_review_problems',
       (SELECT COUNT(*) FROM public.user_review_problems),
       (SELECT COUNT(*) FROM pyquests_backup.user_review_problems_before_001)
UNION ALL SELECT 'user_read_chapters',
       (SELECT COUNT(*) FROM public.user_read_chapters),
       (SELECT COUNT(*) FROM pyquests_backup.user_read_chapters_before_001)
UNION ALL SELECT 'user_quiz_answers',
       (SELECT COUNT(*) FROM public.user_quiz_answers),
       (SELECT COUNT(*) FROM pyquests_backup.user_quiz_answers_before_001)
UNION ALL SELECT 'board_posts',
       (SELECT COUNT(*) FROM public.board_posts),
       (SELECT COUNT(*) FROM pyquests_backup.board_posts_before_001);
