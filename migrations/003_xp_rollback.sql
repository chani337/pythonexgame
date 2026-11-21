-- =====================================================================
-- 003 rollback — back to the ranking views without XP
-- =====================================================================
-- CREATE OR REPLACE VIEW can't drop columns, so the views are dropped and
-- recreated as 001 left them. Nothing else depends on them, and no data is
-- touched: XP was never stored.
-- =====================================================================

DROP VIEW IF EXISTS public.language_leaderboard_public;
DROP VIEW IF EXISTS public.weekly_leaderboard_public;
DROP VIEW IF EXISTS public.leaderboard_public;
DROP VIEW IF EXISTS public.user_xp;
DROP FUNCTION IF EXISTS public.problem_xp(TEXT, TEXT);

CREATE VIEW public.leaderboard_public AS
  SELECT
    p.id,
    p.display_name,
    p.streak,
    p.solved_count
  FROM public.profiles p
  WHERE p.hidden = false;

GRANT SELECT ON public.leaderboard_public TO anon, authenticated;

CREATE VIEW public.language_leaderboard_public AS
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

CREATE VIEW public.weekly_leaderboard_public AS
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
