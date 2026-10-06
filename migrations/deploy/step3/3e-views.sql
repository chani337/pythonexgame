-- ---------------------------------------------------------------------
-- STEP 6 — Views: exclude hidden accounts, add a public activity feed
-- ---------------------------------------------------------------------

CREATE OR REPLACE VIEW public.leaderboard_public AS
  SELECT
    p.id,
    p.display_name,
    p.streak,
    p.solved_count
  FROM public.profiles p
  WHERE p.hidden = false;

-- solved_count is now a trigger-maintained column, so the GROUP BY subquery
-- that used to live here (added to dodge PostgREST's 1000-row cap when the
-- client counted rows itself) is no longer needed -- one row per profile
-- either way, and no aggregate per refresh.

GRANT SELECT ON public.leaderboard_public TO anon, authenticated;

-- Lets the dashboard activity feed work without granting anon a direct read
-- of every row of user_solved_problems. Replaces two client round-trips
-- (raw rows, then a display_name lookup per row) with one, and hides the
-- user_id entirely -- the feed only ever renders a name and a problem title.
CREATE OR REPLACE VIEW public.recent_activity_public AS
  SELECT
    s.problem_id,
    s.solved_at,
    p.display_name
  FROM public.user_solved_problems s
  JOIN public.problems pr ON pr.id = s.problem_id
  JOIN public.profiles p  ON p.id = s.user_id
  WHERE p.hidden = false
  ORDER BY s.solved_at DESC
  LIMIT 50;

GRANT SELECT ON public.recent_activity_public TO anon, authenticated;

COMMENT ON VIEW public.recent_activity_public IS
  'Last 50 solves with display_name only, no user_id. Exists so user_solved_problems does not need a public SELECT policy.';

-- Dashboard's per-language and weekly ranking tabs used to page through every
-- row of user_solved_problems with .range() and count client-side -- which
-- needed the public SELECT policy that STEP 7 removes, and meant anonymous
-- visitors downloaded the whole table on every tab switch. public.problems
-- (STEP 1) carries `language`, so the join can finally happen server-side.
CREATE OR REPLACE VIEW public.language_leaderboard_public AS
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

-- date_trunc('week') starts weeks on Monday, matching the client's previous
-- "days since Monday" arithmetic. Evaluated in Asia/Seoul so the week rolls
-- over at local midnight rather than UTC.
CREATE OR REPLACE VIEW public.weekly_leaderboard_public AS
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


-- ---------------------------------------------------------------------
