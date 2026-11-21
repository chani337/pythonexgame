-- =====================================================================
-- 003 — XP, levels and tiers for the ranking
-- =====================================================================
-- Requires 001 (public.problems and the ranking views). Safe to re-run.
--
-- XP is derived, never stored: each view sums public.problem_xp() over the
-- user's solved problems. Nothing writes XP, so nothing new needs the
-- write-protection that 001 put around solved_count and streak -- a client
-- can't claim XP for a problem it can't insert into user_solved_problems.
--
-- The weights must match src/utils/levels.ts (tests/levels.test.ts checks
-- this file against it).
--
-- Only views and one function change, so the rollback is just restoring the
-- previous view definitions (003_xp_rollback.sql).
-- =====================================================================

-- Coding problems by difficulty; quiz and fill-in-the-blank a flat 5.
CREATE OR REPLACE FUNCTION public.problem_xp(p_type TEXT, p_difficulty TEXT)
RETURNS INT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN p_type <> 'coding'          THEN 5
    WHEN p_difficulty = 'basic'        THEN 10
    WHEN p_difficulty = 'intermediate' THEN 20
    WHEN p_difficulty = 'advanced'     THEN 40
    WHEN p_difficulty = 'expert'       THEN 80
    ELSE 0
  END
$$;

-- Total XP per user. Internal: the public views below expose it next to a
-- display name, never with a user's other data, so this one stays closed.
-- (Supabase grants new objects in public to anon/authenticated by default.)
CREATE OR REPLACE VIEW public.user_xp AS
  SELECT
    s.user_id,
    SUM(public.problem_xp(p.type, p.difficulty))::int AS xp
  FROM public.user_solved_problems s
  JOIN public.problems p ON p.id = s.problem_id
  GROUP BY s.user_id;

REVOKE ALL ON public.user_xp FROM anon, authenticated;

-- New columns go last: CREATE OR REPLACE VIEW can only append.
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
