-- =====================================================================
-- 004 rollback — remove titles and name colors
-- =====================================================================
-- Restores the ranking views as 003 left them and removes the check. The
-- title_id / name_color columns are kept so a re-apply restores everyone's
-- picks; drop them by hand if 004 is being abandoned for good:
--   ALTER TABLE public.profiles DROP COLUMN title_id, DROP COLUMN name_color;
-- =====================================================================

DROP TRIGGER IF EXISTS profiles_check_cosmetics ON public.profiles;
DROP FUNCTION IF EXISTS public.check_profile_cosmetics();
DROP FUNCTION IF EXISTS public.user_total_xp(UUID);
DROP FUNCTION IF EXISTS public.cosmetic_min_xp(TEXT);

-- CREATE OR REPLACE VIEW can't drop columns.
DROP VIEW IF EXISTS public.language_leaderboard_public;
DROP VIEW IF EXISTS public.weekly_leaderboard_public;
DROP VIEW IF EXISTS public.leaderboard_public;

CREATE OR REPLACE VIEW public.leaderboard_public AS
  SELECT
    p.id,
    p.display_name,
    p.streak,
    p.solved_count,
    COALESCE(x.xp, 0) AS xp
  FROM public.profiles p
  LEFT JOIN public.user_xp x ON x.user_id = p.id
  WHERE p.hidden = false;

GRANT SELECT ON public.leaderboard_public TO anon, authenticated;

-- xp is this language's; total_xp decides the tier shown beside the name.
CREATE OR REPLACE VIEW public.language_leaderboard_public AS
  SELECT
    pr.id,
    pr.display_name,
    pr.streak,
    p.language,
    COUNT(*)::int AS solved_count,
    SUM(public.problem_xp(p.type, p.difficulty))::int AS xp,
    COALESCE(MAX(x.xp), 0) AS total_xp
  FROM public.user_solved_problems s
  JOIN public.problems p  ON p.id  = s.problem_id
  JOIN public.profiles pr ON pr.id = s.user_id
  LEFT JOIN public.user_xp x ON x.user_id = pr.id
  WHERE pr.hidden = false
  GROUP BY pr.id, pr.display_name, pr.streak, p.language;

GRANT SELECT ON public.language_leaderboard_public TO anon, authenticated;

-- xp is this week's; total_xp decides the tier.
CREATE OR REPLACE VIEW public.weekly_leaderboard_public AS
  SELECT
    pr.id,
    pr.display_name,
    pr.streak,
    COUNT(*)::int AS solved_count,
    SUM(public.problem_xp(p.type, p.difficulty))::int AS xp,
    COALESCE(MAX(x.xp), 0) AS total_xp
  FROM public.user_solved_problems s
  JOIN public.problems p  ON p.id = s.problem_id
  JOIN public.profiles pr ON pr.id = s.user_id
  LEFT JOIN public.user_xp x ON x.user_id = pr.id
  WHERE pr.hidden = false
    AND (s.solved_at AT TIME ZONE 'Asia/Seoul')
        >= date_trunc('week', NOW() AT TIME ZONE 'Asia/Seoul')
  GROUP BY pr.id, pr.display_name, pr.streak;

GRANT SELECT ON public.weekly_leaderboard_public TO anon, authenticated;
