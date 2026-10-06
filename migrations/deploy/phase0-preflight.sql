-- =====================================================================
-- PyQuests 배포 0단계 — 사전 조사 (읽기 전용)
-- =====================================================================
-- Supabase 대시보드 → SQL Editor 에 이 파일 전체를 붙여넣고 실행하세요.
-- 상세 설명: docs/migrations/001-ranking-integrity.md
--            docs/migrations/002-admin-flag.md
-- 이 파일은 아무것도 변경하지 않습니다. 결과를 캡처해 두세요.
-- =====================================================================


-- (1) 전체 규모. distinct_problem_ids 가 377 을 넘으면 조작이 있었다는 뜻입니다.
SELECT COUNT(*)                        AS total_solved_rows,
       COUNT(DISTINCT user_id)         AS users,
       COUNT(DISTINCT problem_id)      AS distinct_problem_ids
FROM public.user_solved_problems;

-- (2) 상위 사용자. solved_count 가 377 을 넘는 계정이 조작한 계정입니다.
SELECT user_id, COUNT(*) AS solved
FROM public.user_solved_problems
GROUP BY user_id ORDER BY solved DESC LIMIT 20;

-- (3) 비정상 속도: 1분 안에 30건 초과
SELECT user_id, DATE_TRUNC('minute', solved_at) AS minute, COUNT(*) AS inserts
FROM public.user_solved_problems
GROUP BY 1, 2 HAVING COUNT(*) > 30 ORDER BY 3 DESC;

-- (4) 실제 해결 기록으로 설명되지 않는 streak
SELECT p.id, p.display_name, p.streak,
       (SELECT COUNT(DISTINCT (s.solved_at AT TIME ZONE 'Asia/Seoul')::date)
          FROM public.user_solved_problems s WHERE s.user_id = p.id) AS distinct_solve_days
FROM public.profiles p
WHERE p.streak > (SELECT COUNT(DISTINCT (s.solved_at AT TIME ZONE 'Asia/Seoul')::date)
                    FROM public.user_solved_problems s WHERE s.user_id = p.id)
ORDER BY p.streak DESC;

-- (5) 현재 계정 수
SELECT COUNT(*) AS profiles FROM public.profiles;
