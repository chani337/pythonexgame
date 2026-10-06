-- =====================================================================
-- 비상용 — 1b단계 스냅샷으로 되돌리기
-- =====================================================================
-- 평소에는 실행하지 마세요. 백업 스냅샷을 만든 뒤에만 유효합니다.
--
-- 실제 프로덕션에 만들어진 테이블 이름 (2026-10-06 적용 확인):
--   pyquests_backup.profiles_before_001   108행
--   pyquests_backup.solved_before_001    3170행
--   pyquests_backup.review_before_001     829행
--   pyquests_backup.chapters_before_001    60행
--   pyquests_backup.quiz_before_001       101행
--   pyquests_backup.board_before_001        4행
--
-- 001/002 는 행을 삭제하지 않으므로, 보통은 이 파일이 아니라
-- migrations/001_ranking_integrity_rollback.sql 로 트리거만 걷어내면
-- 충분합니다. 이 파일은 "계산된 stat 값까지 원래대로" 돌릴 때만 씁니다.
-- =====================================================================

-- 보호 트리거를 먼저 걷어내야 stat 컬럼을 되돌릴 수 있습니다.
DROP TRIGGER IF EXISTS profiles_protect_stats ON public.profiles;

UPDATE public.profiles p
SET streak           = b.streak,
    solved_count     = b.solved_count,
    last_solved_date = b.last_solved_date,
    sandbox_runs     = b.sandbox_runs,
    display_name     = b.display_name
FROM pyquests_backup.profiles_before_001 b
WHERE p.id = b.id;

-- 혹시 행이 사라진 경우에만 되살립니다 (정상 경로에서는 0건).
INSERT INTO public.user_solved_problems (id, user_id, problem_id, solved_at)
SELECT b.id, b.user_id, b.problem_id, b.solved_at
FROM pyquests_backup.solved_before_001 b
WHERE NOT EXISTS (SELECT 1 FROM public.user_solved_problems s WHERE s.id = b.id)
ON CONFLICT (user_id, problem_id) DO NOTHING;

INSERT INTO public.user_review_problems (id, user_id, problem_id, added_at)
SELECT b.id, b.user_id, b.problem_id, b.added_at
FROM pyquests_backup.review_before_001 b
WHERE NOT EXISTS (SELECT 1 FROM public.user_review_problems r WHERE r.id = b.id)
ON CONFLICT (user_id, problem_id) DO NOTHING;

SELECT 'restored' AS status,
       (SELECT COUNT(*) FROM public.user_solved_problems) AS solved_rows,
       (SELECT COUNT(*) FROM public.user_review_problems) AS review_rows,
       (SELECT COUNT(*) FROM public.profiles)             AS profiles;
