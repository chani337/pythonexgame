-- Supabase Schema for PyQuests Multi-User Learning App
--
-- This file is the full desired state. To change an existing database, apply
-- the numbered file in migrations/ instead -- that one knows how to get from
-- the previous state to this one (data moves, backfills, apply ordering).
--   001_ranking_integrity.sql  + docs/migrations/001-ranking-integrity.md

-- 1. Profiles Table (stores user statistics & nickname)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  streak INT DEFAULT 0,
  last_solved_date TEXT,
  sandbox_runs INT DEFAULT 0,
  solved_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure solved_count column exists if table was created previously
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS solved_count INT DEFAULT 0;

-- Hides an account from leaderboard_public and recent_activity_public. Use
-- for admin/test accounts and confirmed manipulation; replaces the
-- client-side EXCLUDED_LEADERBOARD_IDS list, which could only hide rows
-- the client chose to filter.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT false;

-- Grants support-board moderation and the admin dashboard. Replaces an
-- ADMIN_USER_ID UUID that was hardcoded in three source files and three RLS
-- policies in a public repository. Write-protected like the stat columns --
-- only service_role (the SQL editor) can set it.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Equipped title (칭호) and name color, unlocked by XP (migration 004).
-- NULL = nothing equipped. check_profile_cosmetics() refuses locked ones.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS title_id   TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name_color TEXT;

-- streak / last_solved_date / solved_count are DERIVED, not client-reported.
-- refresh_solver_stats() recomputes them from user_solved_problems on every
-- insert/delete; protect_profile_stats() discards whatever a client sends.
COMMENT ON COLUMN public.profiles.streak           IS 'Server-derived. See refresh_solver_stats().';
COMMENT ON COLUMN public.profiles.last_solved_date IS 'Server-derived (Asia/Seoul, YYYY-MM-DD). See refresh_solver_stats().';
COMMENT ON COLUMN public.profiles.solved_count     IS 'Server-derived. See refresh_solver_stats().';

-- Each user can only read/write their OWN row directly. Public leaderboard
-- access to (id, display_name, streak) goes through the view below instead,
-- which never exposes email -- the anon key is embedded in the client
-- bundle, so anything readable without RLS is effectively public.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Narrowed from GRANT ALL: anon reads nothing here directly (it only reads
-- the two public views below, which run with the view owner's privileges),
-- and authenticated gets exactly the operations the client performs.
REVOKE ALL ON public.profiles FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Public-safe leaderboard view: id/display_name/streak/solved_count, no
-- email. Views run with the owner's privileges by default, so this reads
-- across all rows of the locked-down profiles table while only ever
-- exposing these columns.
--
-- solved_count is read straight from the trigger-maintained column. It used
-- to be aggregated here with a GROUP BY over user_solved_problems, which was
-- itself a fix for the client counting rows and hitting PostgREST's
-- 1000-row response cap. Now that refresh_solver_stats() keeps the column
-- current, neither the client-side count nor the per-refresh aggregate is
-- needed -- one row per profile either way, and no scan.
--
-- hidden accounts (admin, test, confirmed manipulation) are filtered here
-- rather than in the client, so they can't reappear by editing JS.
--
-- Defined further down, after user_solved_problems: it also sums each
-- user's XP from there (migration 003).

-- 1b. Problems Reference Table
-- Database mirror of src/data/problems.ts, so problem_id can be validated by
-- a foreign key instead of being accepted as any string. Seed/refresh with:
--   npm run sync:problems   ->   migrations/problems_seed.sql
CREATE TABLE IF NOT EXISTS public.problems (
  id         TEXT PRIMARY KEY,
  language   TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  type       TEXT NOT NULL,
  synced_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.problems IS
  'Mirror of src/data/problems.ts. Regenerate with `npm run sync:problems`; never edit by hand.';

-- Public read (it is already in the client bundle); no write policy at all,
-- which with RLS enabled means only service_role (which bypasses RLS) can
-- run the seed.
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.problems FROM anon, authenticated;
GRANT SELECT ON public.problems TO anon, authenticated;
GRANT ALL ON public.problems TO service_role;

DROP POLICY IF EXISTS "problems_select_public" ON public.problems;
CREATE POLICY "problems_select_public" ON public.problems
  FOR SELECT USING (true);

-- 2. User Solved Problems Table
-- problem_id is validated against public.problems by the
-- enforce_known_problem_id trigger (section 5), NOT by a foreign key.
--
-- Without any validation, a logged-in user could INSERT thousands of invented
-- problem_ids and top the leaderboard -- solved_count is just a count of
-- these rows, and unique_user_problem only blocks repeats of the SAME id.
--
-- A FK would enforce the same thing, but it cannot be added while existing
-- rows violate it, which would force deleting or moving any row whose
-- problem_id isn't current. From inside the database there is no way to tell
-- such a row apart from real progress against a problem that was later
-- renamed, so the trigger validates new writes while existing rows are left
-- alone and simply excluded from the aggregates.
CREATE TABLE IF NOT EXISTS public.user_solved_problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,
  solved_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_problem UNIQUE (user_id, problem_id)
);

-- Rows written by merge_guest_progress() (guest progress, the admin
-- unlock-all) rather than solved in the account. Left out of contest
-- scores (migration 005).
ALTER TABLE public.user_solved_problems ADD COLUMN IF NOT EXISTS merged BOOLEAN NOT NULL DEFAULT false;

-- Read is scoped to the owning user. The leaderboard and the activity feed
-- both go through the views above, so nothing needs a public read of this
-- table -- which previously let anyone enumerate who solved what and when.
--
-- No UPDATE and no DELETE for authenticated: a solve is insert-only and
-- unique per (user, problem), so withholding them means a stolen session
-- can't rewrite or wipe someone's history. Account deletion still works via
-- the FK cascade from profiles.
ALTER TABLE public.user_solved_problems ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.user_solved_problems FROM anon, authenticated;
GRANT SELECT, INSERT ON public.user_solved_problems TO authenticated;
GRANT ALL ON public.user_solved_problems TO service_role;

DROP POLICY IF EXISTS "solved_select_public" ON public.user_solved_problems;
DROP POLICY IF EXISTS "solved_update_own" ON public.user_solved_problems;

DROP POLICY IF EXISTS "solved_select_own" ON public.user_solved_problems;
CREATE POLICY "solved_select_own" ON public.user_solved_problems
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "solved_insert_own" ON public.user_solved_problems;
CREATE POLICY "solved_insert_own" ON public.user_solved_problems
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feeds the dashboard's "누가 방금 풀었어요" banner. Exists so that
-- user_solved_problems does not need a public SELECT policy: this exposes a
-- display name and a problem id, never a user_id, and only the last 50 rows
-- instead of the whole table.
CREATE OR REPLACE VIEW public.recent_activity_public AS
  SELECT
    s.problem_id,
    s.solved_at,
    pr.display_name
  FROM public.user_solved_problems s
  JOIN public.problems pb ON pb.id = s.problem_id
  JOIN public.profiles pr ON pr.id = s.user_id
  WHERE pr.hidden = false
  ORDER BY s.solved_at DESC
  LIMIT 50;

GRANT SELECT ON public.recent_activity_public TO anon, authenticated;

-- Dashboard's per-language and weekly ranking tabs used to page through every
-- row of user_solved_problems with .range() and count client-side -- which
-- needed the public SELECT policy that STEP 7 removes, and meant anonymous
-- visitors downloaded the whole table on every tab switch. public.problems
-- (STEP 1) carries `language`, so the join can finally happen server-side.
-- XP, levels and tiers (migration 003). Weights match src/utils/levels.ts.
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

-- Titles and name colors (migration 004). Thresholds match src/utils/cosmetics.ts.
-- XP needed for a cosmetic, keyed 'title:<id>' / 'color:<id>'. NULL for an
-- id that doesn't exist, which the check treats as locked.
CREATE OR REPLACE FUNCTION public.cosmetic_min_xp(p_key TEXT)
RETURNS INT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE p_key
    WHEN 'title:newbie'      THEN 0
    WHEN 'title:learner'     THEN 200
    WHEN 'title:bughunter'   THEN 500
    WHEN 'title:alchemist'   THEN 800
    WHEN 'title:explorer'    THEN 1400
    WHEN 'title:senior'      THEN 2000
    WHEN 'title:architect'   THEN 3000
    WHEN 'title:hacker'      THEN 4000
    WHEN 'title:legend'      THEN 5500
    WHEN 'title:grandmaster' THEN 7000
    WHEN 'color:forest'      THEN 200
    WHEN 'color:ocean'       THEN 800
    WHEN 'color:amber'       THEN 1400
    WHEN 'color:violet'      THEN 2000
    WHEN 'color:ruby'        THEN 4000
    WHEN 'color:aurora'      THEN 7000
    ELSE NULL
  END
$$;

-- user_xp is closed to clients, and the check below runs as the client, so
-- it reads XP through this. Only a number per user id, and the same number
-- leaderboard_public already shows for every visible account.
CREATE OR REPLACE FUNCTION public.user_total_xp(p_user_id UUID)
RETURNS INT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT COALESCE((SELECT xp FROM public.user_xp WHERE user_id = p_user_id), 0)
$$;

REVOKE ALL ON FUNCTION public.user_total_xp(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.user_total_xp(UUID) TO authenticated;

-- Not SECURITY DEFINER on purpose: current_user has to stay the caller's
-- role for the "only clients are checked" test, the same one
-- protect_profile_stats() uses -- the SQL editor and service_role can still
-- set anything by hand.
CREATE OR REPLACE FUNCTION public.check_profile_cosmetics()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_xp  INT;
  v_min INT;
BEGIN
  IF current_user NOT IN ('anon', 'authenticated') THEN
    RETURN NEW;
  END IF;

  IF NEW.title_id IS NOT NULL
     AND (TG_OP = 'INSERT' OR NEW.title_id IS DISTINCT FROM OLD.title_id) THEN
    v_xp  := public.user_total_xp(NEW.id);
    v_min := public.cosmetic_min_xp('title:' || NEW.title_id);
    IF v_min IS NULL OR v_min > v_xp THEN
      RAISE EXCEPTION 'pyquests_locked_cosmetic: title "%" needs % XP, have %', NEW.title_id, v_min, v_xp
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  IF NEW.name_color IS NOT NULL
     AND (TG_OP = 'INSERT' OR NEW.name_color IS DISTINCT FROM OLD.name_color) THEN
    v_xp  := public.user_total_xp(NEW.id);
    v_min := public.cosmetic_min_xp('color:' || NEW.name_color);
    IF v_min IS NULL OR v_min > v_xp THEN
      RAISE EXCEPTION 'pyquests_locked_cosmetic: color "%" needs % XP, have %', NEW.name_color, v_min, v_xp
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_check_cosmetics ON public.profiles;
CREATE TRIGGER profiles_check_cosmetics
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.check_profile_cosmetics();

-- The ranking views. title_id / name_color come from migration 004.
CREATE OR REPLACE VIEW public.leaderboard_public AS
  SELECT
    p.id,
    p.display_name,
    p.streak,
    p.solved_count,
    COALESCE(x.xp, 0) AS xp,
    p.title_id,
    p.name_color
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
    COALESCE(MAX(x.xp), 0) AS total_xp,
    pr.title_id,
    pr.name_color
  FROM public.user_solved_problems s
  JOIN public.problems p  ON p.id  = s.problem_id
  JOIN public.profiles pr ON pr.id = s.user_id
  LEFT JOIN public.user_xp x ON x.user_id = pr.id
  WHERE pr.hidden = false
  GROUP BY pr.id, pr.display_name, pr.streak, p.language, pr.title_id, pr.name_color;

GRANT SELECT ON public.language_leaderboard_public TO anon, authenticated;

-- date_trunc('week') starts weeks on Monday, matching the client's previous
-- "days since Monday" arithmetic. Evaluated in Asia/Seoul so the week rolls
-- over at local midnight rather than UTC.
CREATE OR REPLACE VIEW public.weekly_leaderboard_public AS
  SELECT
    pr.id,
    pr.display_name,
    pr.streak,
    COUNT(*)::int AS solved_count,
    SUM(public.problem_xp(p.type, p.difficulty))::int AS xp,
    COALESCE(MAX(x.xp), 0) AS total_xp,
    pr.title_id,
    pr.name_color
  FROM public.user_solved_problems s
  JOIN public.problems p  ON p.id = s.problem_id
  JOIN public.profiles pr ON pr.id = s.user_id
  LEFT JOIN public.user_xp x ON x.user_id = pr.id
  WHERE pr.hidden = false
    AND (s.solved_at AT TIME ZONE 'Asia/Seoul')
        >= date_trunc('week', NOW() AT TIME ZONE 'Asia/Seoul')
  GROUP BY pr.id, pr.display_name, pr.streak, pr.title_id, pr.name_color;

GRANT SELECT ON public.weekly_leaderboard_public TO anon, authenticated;

-- 2b. User Read Chapters Table (학습 가이드 챕터 완료 진도)
CREATE TABLE IF NOT EXISTS public.user_read_chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  chapter_id TEXT NOT NULL,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_chapter UNIQUE (user_id, chapter_id)
);

-- Purely private per-user data, never read publicly -- lock all operations
-- to the owning user.
ALTER TABLE public.user_read_chapters ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_read_chapters FROM anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.user_read_chapters TO authenticated;
GRANT ALL ON public.user_read_chapters TO service_role;

DROP POLICY IF EXISTS "read_chapters_own" ON public.user_read_chapters;
CREATE POLICY "read_chapters_own" ON public.user_read_chapters
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2c. User Review Problems Table (오답노트: 틀렸거나 별표 표시한 문제)
CREATE TABLE IF NOT EXISTS public.user_review_problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,  -- validated by enforce_known_problem_id (section 5)
  added_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_review_problem UNIQUE (user_id, problem_id)
);

-- Purely private per-user data, never read publicly -- lock all operations
-- to the owning user.
ALTER TABLE public.user_review_problems ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_review_problems FROM anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.user_review_problems TO authenticated;
GRANT ALL ON public.user_review_problems TO service_role;

DROP POLICY IF EXISTS "review_problems_own" ON public.user_review_problems;
CREATE POLICY "review_problems_own" ON public.user_review_problems
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2d. User Quiz Answers Table (학습가이드 챕터 내 이해도 체크 퀴즈 정답 기록)
CREATE TABLE IF NOT EXISTS public.user_quiz_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  chapter_id TEXT NOT NULL,
  question_index INT NOT NULL,
  answer_index INT NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_chapter_question UNIQUE (user_id, chapter_id, question_index)
);

-- Purely private per-user data, never read publicly -- lock all operations
-- to the owning user.
ALTER TABLE public.user_quiz_answers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_quiz_answers FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_quiz_answers TO authenticated;
GRANT ALL ON public.user_quiz_answers TO service_role;

DROP POLICY IF EXISTS "quiz_answers_own" ON public.user_quiz_answers;
CREATE POLICY "quiz_answers_own" ON public.user_quiz_answers
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2e. Board Posts Table (1:1 문의하기 -- 고객센터 게시판)
-- Each member can only read/write their own posts; only the admin account
-- can see and reply to everyone's. Guests never reach this table at all
-- (the client gates the whole feature behind login).
CREATE TABLE IF NOT EXISTS public.board_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT '답변대기' NOT NULL,
  admin_reply TEXT,
  admin_reply_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.board_posts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.board_posts FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.board_posts TO authenticated;
GRANT ALL ON public.board_posts TO service_role;

-- Reads the caller's own flag. SECURITY DEFINER so it doesn't depend on
-- profiles' SELECT policy, STABLE so the planner calls it once per statement
-- instead of once per row.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT COALESCE((SELECT p.is_admin FROM public.profiles p WHERE p.id = auth.uid()), false);
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

DROP POLICY IF EXISTS "board_select_own_or_admin" ON public.board_posts;
CREATE POLICY "board_select_own_or_admin" ON public.board_posts
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "board_insert_own" ON public.board_posts;
CREATE POLICY "board_insert_own" ON public.board_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "board_update_own_or_admin" ON public.board_posts;
CREATE POLICY "board_update_own_or_admin" ON public.board_posts
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "board_delete_own_or_admin" ON public.board_posts;
CREATE POLICY "board_delete_own_or_admin" ON public.board_posts
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- 3. Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Sync all existing registered users in auth.users to public.profiles
INSERT INTO public.profiles (id, email, display_name)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'display_name', split_part(email, '@', 1))
FROM auth.users
ON CONFLICT (id) DO NOTHING;


-- =====================================================================
-- 5. Derived solver stats, write protection, rate limit, guest merge
-- =====================================================================
-- Everything below exists because streak / solved_count / last_solved_date
-- used to be whatever the client said they were. See
-- docs/migrations/001-ranking-integrity.md.

-- Consecutive days (Asia/Seoul) with at least one solve, counted back from
-- the most recent solve day. Returns 0 once that day is older than
-- yesterday -- "yesterday" rather than "today" so a streak doesn't look
-- reset every morning before the day's first solve.
CREATE OR REPLACE FUNCTION public.calculate_streak(p_user_id UUID)
RETURNS INT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  WITH today AS (
    SELECT (NOW() AT TIME ZONE 'Asia/Seoul')::date AS d
  ),
  solve_days AS (
    SELECT DISTINCT (s.solved_at AT TIME ZONE 'Asia/Seoul')::date AS d
    FROM public.user_solved_problems s
    -- Only solves of real problems build a streak, so a day fabricated with
    -- invented ids contributes nothing.
    JOIN public.problems p ON p.id = s.problem_id
    WHERE s.user_id = p_user_id
      AND (s.solved_at AT TIME ZONE 'Asia/Seoul')::date <= (SELECT d FROM today)
  ),
  ranked AS (
    SELECT d, ROW_NUMBER() OVER (ORDER BY d DESC) AS rn FROM solve_days
  ),
  newest AS (
    SELECT MAX(d) AS last_day FROM solve_days
  )
  -- Days are distinct and descending, so rn rises by exactly 1 while an
  -- unbroken run's dates fall by exactly 1. The equality therefore holds for
  -- precisely the contiguous run ending at last_day, and fails for every row
  -- past the first gap.
  SELECT COALESCE((
    SELECT COUNT(*)::int
    FROM ranked r, newest n, today t
    WHERE n.last_day >= t.d - 1
      -- rn is bigint (ROW_NUMBER); date arithmetic only has a date - integer
      -- operator, so the offset has to be cast explicitly.
      AND r.d = n.last_day - (r.rn - 1)::int
  ), 0);
$$;

COMMENT ON FUNCTION public.calculate_streak(UUID) IS
  'Current consecutive-day solve streak in Asia/Seoul, derived from user_solved_problems.';

-- Discards client writes to the derived columns by restoring the old values
-- instead of raising. Erroring would break the signup and fetchProfile
-- upserts, which send `streak: 0` inside a wider payload -- this way an
-- outdated client keeps working while its stat values stop mattering.
-- (Column-level REVOKE UPDATE was the alternative; it 403s those upserts,
-- which is a worse failure mode during a rollout.)
CREATE OR REPLACE FUNCTION public.protect_profile_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only the client roles are untrusted. PostgREST sets the role per request
  -- (anon / authenticated / service_role), and the Supabase SQL editor runs
  -- as postgres -- so an administrator fixing a row by hand, and the
  -- service_role key, both still work. Without this check the trigger also
  -- silently swallowed `UPDATE profiles SET hidden = true` from the SQL
  -- editor, which is exactly how an account gets hidden or made admin.
  IF current_user NOT IN ('anon', 'authenticated') THEN
    RETURN NEW;
  END IF;

  -- refresh_solver_stats() sets this flag before its own UPDATE. It is
  -- SECURITY DEFINER so current_user is already the owner there, but the
  -- flag keeps the intent explicit and covers the backfill block too.
  IF COALESCE(current_setting('pyquests.trusted_stats_write', true), 'off') = 'on' THEN
    RETURN NEW;
  END IF;

  NEW.streak           := OLD.streak;
  NEW.last_solved_date := OLD.last_solved_date;
  NEW.solved_count     := OLD.solved_count;
  NEW.hidden           := OLD.hidden;
  -- Without this, `update({ is_admin: true })` would hand anyone moderation
  -- over every support-board post.
  NEW.is_admin         := OLD.is_admin;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_protect_stats ON public.profiles;
CREATE TRIGGER profiles_protect_stats
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_stats();

-- Recomputes the derived columns for every user touched by the statement.
-- Statement-level with a transition table rather than FOR EACH ROW, so a
-- bulk merge costs one recompute per user instead of one per inserted row.
CREATE OR REPLACE FUNCTION public.refresh_solver_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  affected UUID[];
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT ARRAY_AGG(DISTINCT user_id) INTO affected FROM inserted;
  ELSE
    SELECT ARRAY_AGG(DISTINCT user_id) INTO affected FROM deleted;
  END IF;

  IF affected IS NULL THEN
    RETURN NULL;
  END IF;

  PERFORM set_config('pyquests.trusted_stats_write', 'on', true);

  UPDATE public.profiles p
  SET streak           = public.calculate_streak(p.id),
      solved_count     = COALESCE(agg.cnt, 0),
      last_solved_date = agg.last_day,
      updated_at       = NOW()
  FROM (
    SELECT u.id,
           -- Joined to public.problems so a leftover invented id inflates
           -- nothing, without those rows having to be deleted.
           (SELECT COUNT(*) FROM public.user_solved_problems s
              JOIN public.problems p2 ON p2.id = s.problem_id
            WHERE s.user_id = u.id) AS cnt,
           (SELECT TO_CHAR(MAX(s.solved_at AT TIME ZONE 'Asia/Seoul'), 'YYYY-MM-DD')
              FROM public.user_solved_problems s
              JOIN public.problems p2 ON p2.id = s.problem_id
            WHERE s.user_id = u.id) AS last_day
    FROM UNNEST(affected) AS u(id)
  ) agg
  WHERE p.id = agg.id;

  PERFORM set_config('pyquests.trusted_stats_write', 'off', true);
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS solved_refresh_stats_insert ON public.user_solved_problems;
CREATE TRIGGER solved_refresh_stats_insert
  AFTER INSERT ON public.user_solved_problems
  REFERENCING NEW TABLE AS inserted
  FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_solver_stats();

DROP TRIGGER IF EXISTS solved_refresh_stats_delete ON public.user_solved_problems;
CREATE TRIGGER solved_refresh_stats_delete
  AFTER DELETE ON public.user_solved_problems
  REFERENCING OLD TABLE AS deleted
  FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_solver_stats();

-- Lets an admin force a stat recompute without touching a solve row. Needed
-- after fixing a renamed problem id: putting the id back into public.problems
-- makes the rows countable again, but refresh_solver_stats only fires on
-- changes to user_solved_problems, so nothing would recompute on its own.
--
--   SELECT public.recompute_solver_stats();                 -- everyone
--   SELECT public.recompute_solver_stats('<uuid>'::uuid);    -- one account
CREATE OR REPLACE FUNCTION public.recompute_solver_stats(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (user_id UUID, display_name TEXT, solved_count INT, streak INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM set_config('pyquests.trusted_stats_write', 'on', true);

  UPDATE public.profiles p
  SET streak           = public.calculate_streak(p.id),
      solved_count     = COALESCE((SELECT COUNT(*) FROM public.user_solved_problems s
                                     JOIN public.problems p2 ON p2.id = s.problem_id
                                   WHERE s.user_id = p.id), 0),
      last_solved_date = (SELECT TO_CHAR(MAX(s.solved_at AT TIME ZONE 'Asia/Seoul'), 'YYYY-MM-DD')
                            FROM public.user_solved_problems s
                            JOIN public.problems p2 ON p2.id = s.problem_id
                          WHERE s.user_id = p.id),
      updated_at       = NOW()
  WHERE p_user_id IS NULL OR p.id = p_user_id;

  PERFORM set_config('pyquests.trusted_stats_write', 'off', true);

  RETURN QUERY
    SELECT p.id, p.display_name, p.solved_count, p.streak
    FROM public.profiles p
    WHERE p_user_id IS NULL OR p.id = p_user_id
    ORDER BY p.solved_count DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.recompute_solver_stats(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recompute_solver_stats(UUID) TO service_role;

COMMENT ON FUNCTION public.recompute_solver_stats(UUID) IS
  'Admin-only stat recompute. Use after changing public.problems (e.g. restoring a renamed id) since refresh_solver_stats only triggers on solve-row changes.';

-- Validates problem_id on write. Used instead of a foreign key so that no
-- existing row ever has to be deleted to add the constraint -- see the comment
-- on user_solved_problems above.
CREATE OR REPLACE FUNCTION public.enforce_known_problem_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.problems p WHERE p.id = NEW.problem_id) THEN
    RAISE EXCEPTION 'pyquests_unknown_problem: "%" 는 존재하지 않는 문제 id 입니다', NEW.problem_id
      USING ERRCODE = 'foreign_key_violation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS solved_known_problem ON public.user_solved_problems;
CREATE TRIGGER solved_known_problem
  BEFORE INSERT OR UPDATE OF problem_id ON public.user_solved_problems
  FOR EACH ROW EXECUTE FUNCTION public.enforce_known_problem_id();

DROP TRIGGER IF EXISTS review_known_problem ON public.user_review_problems;
CREATE TRIGGER review_known_problem
  BEFORE INSERT OR UPDATE OF problem_id ON public.user_review_problems
  FOR EACH ROW EXECUTE FUNCTION public.enforce_known_problem_id();

-- Secondary defence only: the validation above already caps the reachable
-- total at the real problem count, so this is about stopping write-flood
-- abuse rather than rank inflation.
--
-- 30/minute = one solve every 2 seconds sustained. The fastest legitimate
-- pattern is a student clicking through quiz/fill problems they already
-- know, which runs about 4-6 seconds each including the result screen, so 30
-- leaves better than 2x headroom. Bulk merges set the bypass flag.
CREATE OR REPLACE FUNCTION public.enforce_solve_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  recent         INT;
  max_per_minute CONSTANT INT := 30;
BEGIN
  IF COALESCE(current_setting('pyquests.bulk_merge', true), 'off') = 'on' THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO recent
  FROM public.user_solved_problems
  WHERE user_id = NEW.user_id
    AND solved_at > NOW() - INTERVAL '1 minute';

  IF recent >= max_per_minute THEN
    RAISE EXCEPTION
      'pyquests_rate_limit: more than % solves in one minute', max_per_minute
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS solved_rate_limit ON public.user_solved_problems;
CREATE TRIGGER solved_rate_limit
  BEFORE INSERT ON public.user_solved_problems
  FOR EACH ROW EXECUTE FUNCTION public.enforce_solve_rate_limit();

-- Merges a guest's localStorage solve list into the caller's account in one
-- statement: filters unknown problem ids, bypasses the per-minute limit, and
-- is idempotent. Used by backlog item 7 (guest progress -> login).
-- Output columns changed (added already_owned_count), which CREATE OR REPLACE
-- cannot do -- drop first.
DROP FUNCTION IF EXISTS public.merge_guest_progress(TEXT[]);

CREATE FUNCTION public.merge_guest_progress(p_problem_ids TEXT[])
RETURNS TABLE (merged_count INT, already_owned_count INT, skipped_count INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  uid           UUID := auth.uid();
  requested     INT  := COALESCE(ARRAY_LENGTH(p_problem_ids, 1), 0);
  valid_ids     TEXT[];
  valid_count   INT;
  inserted_rows INT  := 0;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'merge_guest_progress requires an authenticated session'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF requested = 0 THEN
    RETURN QUERY SELECT 0, 0, 0;
    RETURN;
  END IF;

  -- Bounded so this can't be used as an unlimited write primitive; the real
  -- problem set is in the hundreds, so anything near 1000 isn't a merge.
  IF requested > 1000 THEN
    RAISE EXCEPTION 'merge_guest_progress: too many ids (%)', requested
      USING ERRCODE = 'program_limit_exceeded';
  END IF;

  SELECT ARRAY_AGG(t.pid) INTO valid_ids
  FROM (SELECT DISTINCT UNNEST(p_problem_ids) AS pid) t
  WHERE EXISTS (SELECT 1 FROM public.problems p WHERE p.id = t.pid);

  valid_count := COALESCE(ARRAY_LENGTH(valid_ids, 1), 0);

  IF valid_count > 0 THEN
    PERFORM set_config('pyquests.bulk_merge', 'on', true);

    -- Count rows the INSERT actually added, not the ids that were valid --
    -- re-running a merge must report 0 newly saved, otherwise the client
    -- tells the user "saved N problems" every single login.
    WITH ins AS (
      INSERT INTO public.user_solved_problems (user_id, problem_id, merged)
      SELECT uid, pid, true FROM UNNEST(valid_ids) AS pid
      ON CONFLICT (user_id, problem_id) DO NOTHING
      RETURNING 1
    )
    SELECT COUNT(*)::int INTO inserted_rows FROM ins;

    PERFORM set_config('pyquests.bulk_merge', 'off', true);
  END IF;

  RETURN QUERY SELECT inserted_rows, valid_count - inserted_rows, requested - valid_count;
END;
$$;

REVOKE ALL ON FUNCTION public.merge_guest_progress(TEXT[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.merge_guest_progress(TEXT[]) TO authenticated;


-- =====================================================================
-- 6. 과정 대항전 and the Christmas tree (migration 005)
-- =====================================================================
-- See migrations/005_contest.sql for why each piece exists.

-- First wrong pick on a quiz problem. A quiz has a handful of options, so
-- retrying until it says correct always works; for the contest only a quiz
-- answered right before any miss counts. One row per problem: the first miss.
CREATE TABLE IF NOT EXISTS public.user_quiz_misses (
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,
  missed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, problem_id)
);

-- First look at a problem's answer code. Not a penalty (a pass after it is
-- already not saved); the roster shows teachers who is stuck where.
CREATE TABLE IF NOT EXISTS public.user_answer_views (
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,
  viewed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, problem_id)
);

-- Insert-only, own rows. No UPDATE: missed_at / viewed_at would otherwise be
-- movable to after the solve.
ALTER TABLE public.user_quiz_misses ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_quiz_misses FROM anon, authenticated;
GRANT SELECT, INSERT ON public.user_quiz_misses TO authenticated;
GRANT ALL ON public.user_quiz_misses TO service_role;

DROP POLICY IF EXISTS "quiz_misses_select_own" ON public.user_quiz_misses;
CREATE POLICY "quiz_misses_select_own" ON public.user_quiz_misses
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "quiz_misses_insert_own" ON public.user_quiz_misses;
CREATE POLICY "quiz_misses_insert_own" ON public.user_quiz_misses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.user_answer_views ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_answer_views FROM anon, authenticated;
GRANT SELECT, INSERT ON public.user_answer_views TO authenticated;
GRANT ALL ON public.user_answer_views TO service_role;

DROP POLICY IF EXISTS "answer_views_select_own" ON public.user_answer_views;
CREATE POLICY "answer_views_select_own" ON public.user_answer_views
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "answer_views_insert_own" ON public.user_answer_views;
CREATE POLICY "answer_views_insert_own" ON public.user_answer_views
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS quiz_misses_known_problem ON public.user_quiz_misses;
CREATE TRIGGER quiz_misses_known_problem
  BEFORE INSERT ON public.user_quiz_misses
  FOR EACH ROW EXECUTE FUNCTION public.enforce_known_problem_id();

DROP TRIGGER IF EXISTS answer_views_known_problem ON public.user_answer_views;
CREATE TRIGGER answer_views_known_problem
  BEFORE INSERT ON public.user_answer_views
  FOR EACH ROW EXECUTE FUNCTION public.enforce_known_problem_id();

-- ---------------------------------------------------------------------
-- STEP 2 — the contest tables (no client access; see the functions)
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.contests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 40),
  starts_on    DATE NOT NULL,             -- first scoring day, Korean time
  ends_on      DATE NOT NULL,             -- last scoring day, inclusive
  -- problems.language values (the track: 'python', 'pylib', 'sql', …)
  languages    TEXT[] NOT NULL DEFAULT ARRAY['python'],
  difficulties TEXT[] NOT NULL DEFAULT ARRAY['basic', 'intermediate'],
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (ends_on >= starts_on)
);

CREATE TABLE IF NOT EXISTS public.contest_classes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id   UUID NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
  name         TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 30),
  teacher_name TEXT CHECK (char_length(teacher_name) <= 20),
  -- 수강 정원. The per-head average divides by this when set, so leaving a
  -- slow student out of the contest doesn't raise a class's average.
  capacity     INT CHECK (capacity IS NULL OR capacity BETWEEN 1 AND 500),
  student_code TEXT NOT NULL UNIQUE,
  teacher_code TEXT NOT NULL UNIQUE,
  cheer        TEXT CHECK (char_length(cheer) <= 60),
  sort_order   INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.contest_participants (
  contest_id UUID NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
  class_id   UUID NOT NULL REFERENCES public.contest_classes(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  real_name  TEXT NOT NULL CHECK (char_length(real_name) BETWEEN 1 AND 20),
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- One class per account per contest.
  PRIMARY KEY (contest_id, user_id)
);

CREATE INDEX IF NOT EXISTS contest_participants_class ON public.contest_participants (class_id);

CREATE TABLE IF NOT EXISTS public.contest_teachers (
  class_id UUID NOT NULL REFERENCES public.contest_classes(id) ON DELETE CASCADE,
  user_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (class_id, user_id)
);

-- Wrong codes, for "5 in a row, then wait a minute".
CREATE TABLE IF NOT EXISTS public.contest_code_attempts (
  user_id  UUID NOT NULL,
  tried_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contest_code_attempts_user ON public.contest_code_attempts (user_id, tried_at);

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['contests', 'contest_classes', 'contest_participants', 'contest_teachers', 'contest_code_attempts'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;

-- ---------------------------------------------------------------------
-- STEP 3 — internal helpers (not callable by clients)
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.kst_today()
RETURNS DATE
LANGUAGE sql
STABLE
AS $$
  SELECT (NOW() AT TIME ZONE 'Asia/Seoul')::date
$$;

-- Upper case, no spaces or hyphens: "py-7k2a" and "PY7K2A" are one code.
CREATE OR REPLACE FUNCTION public.contest_normalize_code(p_code TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT upper(regexp_replace(COALESCE(p_code, ''), '[[:space:]-]', '', 'g'))
$$;

-- Six characters with 0/O, 1/I/L left out so a code read off a projector
-- can't be mistyped into another one.
CREATE OR REPLACE FUNCTION public.contest_new_code()
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  alphabet CONSTANT TEXT := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v TEXT;
BEGIN
  LOOP
    v := '';
    FOR i IN 1..6 LOOP
      v := v || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.contest_classes WHERE student_code = v OR teacher_code = v
    );
  END LOOP;
  RETURN v;
END;
$$;

-- The contest the site shows: the newest one that hasn't been over for a
-- week (the week after is for the results). Upcoming ones count, so a
-- contest made in December shows its countdown and takes sign-ups.
CREATE OR REPLACE FUNCTION public.contest_current_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT id FROM public.contests
  WHERE ends_on + 7 >= public.kst_today()
  ORDER BY starts_on DESC, created_at DESC
  LIMIT 1
$$;

-- Every solve that scores for the contest, with the solver's class.
CREATE OR REPLACE FUNCTION public.contest_scored_solves(p_contest_id UUID)
RETURNS TABLE (user_id UUID, class_id UUID, problem_id TEXT, solved_at TIMESTAMPTZ, day DATE)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT cp.user_id, cp.class_id, s.problem_id, s.solved_at,
         (s.solved_at AT TIME ZONE 'Asia/Seoul')::date
  FROM public.contests c
  JOIN public.contest_participants cp ON cp.contest_id = c.id
  JOIN public.profiles pr ON pr.id = cp.user_id AND pr.hidden = false
  JOIN public.user_solved_problems s ON s.user_id = cp.user_id AND s.merged = false
  JOIN public.problems pb ON pb.id = s.problem_id
  WHERE c.id = p_contest_id
    AND (s.solved_at AT TIME ZONE 'Asia/Seoul')::date BETWEEN c.starts_on AND c.ends_on
    AND pb.language = ANY (c.languages)
    AND pb.difficulty = ANY (c.difficulties)
    AND (pb.type <> 'quiz' OR NOT EXISTS (
      SELECT 1 FROM public.user_quiz_misses m
      WHERE m.user_id = s.user_id AND m.problem_id = s.problem_id AND m.missed_at <= s.solved_at
    ))
$$;

-- The caller teaches this class, or is the admin.
CREATE OR REPLACE FUNCTION public.contest_can_manage(p_class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT public.is_admin() OR EXISTS (
    SELECT 1 FROM public.contest_teachers t
    WHERE t.class_id = p_class_id AND t.user_id = auth.uid()
  )
$$;

REVOKE ALL ON FUNCTION public.contest_new_code() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.contest_current_id() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.contest_scored_solves(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.contest_can_manage(UUID) FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------
-- STEP 4 — the public board (anyone, logged in or not)
-- ---------------------------------------------------------------------
-- Class totals only: names of classes and teachers, counts, rounds, and the
-- MVPs by site nickname. Real names never leave contest_roster().

CREATE OR REPLACE FUNCTION public.contest_board()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  c           public.contests%ROWTYPE;
  v_today     DATE := public.kst_today();
  v_last      DATE;
  v_rounds    INT;
  v_round_now INT;
  v_mvp_round INT;
  v_uid       UUID := auth.uid();
  v_board     JSONB;
  v_mine      JSONB := NULL;
BEGIN
  SELECT * INTO c FROM public.contests WHERE id = public.contest_current_id();
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  v_last := LEAST(v_today, c.ends_on);
  v_rounds := CEIL((c.ends_on - c.starts_on + 1) / 7.0)::int;
  v_round_now := CASE
    WHEN v_today < c.starts_on THEN 0
    ELSE LEAST(v_rounds, (v_last - c.starts_on) / 7 + 1)
  END;
  -- MVPs are for the round in progress, or the last one once it's over.
  v_mvp_round := v_round_now;

  WITH
  cls AS (
    SELECT k.*, (SELECT COUNT(*) FROM public.contest_participants p WHERE p.class_id = k.id)::int AS participants
    FROM public.contest_classes k
    WHERE k.contest_id = c.id
  ),
  den AS (
    SELECT id, GREATEST(COALESCE(capacity, participants), 1) AS d FROM cls
  ),
  sv AS (
    SELECT * FROM public.contest_scored_solves(c.id)
  ),
  tot AS (
    SELECT sv.class_id, COUNT(*)::int AS solved FROM sv GROUP BY sv.class_id
  ),
  per_day AS (
    SELECT sv.class_id, sv.day, COUNT(DISTINCT sv.user_id)::int AS solvers
    FROM sv GROUP BY sv.class_id, sv.day
  ),
  -- A star for each day the whole class (정원, or everyone who joined) solved.
  stars AS (
    SELECT pd.class_id, COUNT(*)::int AS stars
    FROM per_day pd JOIN den ON den.id = pd.class_id JOIN cls ON cls.id = pd.class_id
    WHERE cls.participants > 0 AND pd.solvers >= den.d
    GROUP BY pd.class_id
  ),
  rounds AS (
    SELECT r,
           c.starts_on + 7 * (r - 1) AS r_start,
           LEAST(c.starts_on + 7 * r - 1, c.ends_on) AS r_end
    FROM generate_series(1, v_rounds) AS r
  ),
  round_class AS (
    SELECT rd.r, k.id AS class_id,
           ROUND((SELECT COUNT(*) FROM sv WHERE sv.class_id = k.id AND sv.day BETWEEN rd.r_start AND rd.r_end)::numeric / den.d, 2) AS avg
    FROM rounds rd CROSS JOIN cls k JOIN den ON den.id = k.id
  ),
  round_best AS (
    SELECT rc.r, MAX(rc.avg) AS best FROM round_class rc GROUP BY rc.r
  ),
  -- A round's winner: the single class on top. A tie, or nobody solving, has none.
  round_winner AS (
    SELECT rc.r, (ARRAY_AGG(rc.class_id))[1] AS winner
    FROM round_class rc JOIN round_best b ON b.r = rc.r AND rc.avg = b.best
    WHERE b.best > 0
    GROUP BY rc.r
    HAVING COUNT(*) = 1
  ),
  cur AS (
    SELECT * FROM rounds WHERE r = v_mvp_round
  ),
  user_round AS (
    SELECT sv.class_id, sv.user_id,
           COUNT(*) FILTER (WHERE sv.day BETWEEN cur.r_start AND cur.r_end)::int AS now_n,
           COUNT(*) FILTER (WHERE sv.day BETWEEN cur.r_start - 7 AND cur.r_start - 1)::int AS prev_n
    FROM sv CROSS JOIN cur
    GROUP BY sv.class_id, sv.user_id
  ),
  mvp AS (
    SELECT DISTINCT ON (ur.class_id) ur.class_id, pr.display_name, ur.now_n
    FROM user_round ur JOIN public.profiles pr ON pr.id = ur.user_id
    WHERE ur.now_n > 0
    ORDER BY ur.class_id, ur.now_n DESC, pr.display_name
  ),
  -- 성장상: the biggest jump on the round before. None in round 1.
  growth AS (
    SELECT DISTINCT ON (ur.class_id) ur.class_id, pr.display_name, ur.now_n - ur.prev_n AS gain
    FROM user_round ur JOIN public.profiles pr ON pr.id = ur.user_id
    WHERE v_mvp_round > 1 AND ur.now_n - ur.prev_n > 0
    ORDER BY ur.class_id, ur.now_n - ur.prev_n DESC, pr.display_name
  ),
  days AS (
    SELECT d::date AS day FROM generate_series(c.starts_on, v_last, INTERVAL '1 day') AS d
  )
  SELECT jsonb_build_object(
    'contest', jsonb_build_object(
      'id', c.id, 'name', c.name, 'starts_on', c.starts_on, 'ends_on', c.ends_on,
      'today', v_today, 'rounds', v_rounds, 'round_now', v_round_now,
      'languages', to_jsonb(c.languages), 'difficulties', to_jsonb(c.difficulties)
    ),
    'classes', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', k.id, 'name', k.name, 'teacher_name', k.teacher_name,
        'capacity', k.capacity, 'participants', k.participants, 'denominator', den.d,
        'solved', COALESCE(t.solved, 0), 'stars', COALESCE(s.stars, 0), 'cheer', k.cheer,
        'today_solvers', COALESCE((SELECT pd.solvers FROM per_day pd WHERE pd.class_id = k.id AND pd.day = v_today), 0),
        'round_wins', (SELECT COUNT(*) FROM round_winner w JOIN rounds rd ON rd.r = w.r WHERE w.winner = k.id AND rd.r_end < v_today)::int,
        'mvp', (SELECT jsonb_build_object('name', m.display_name, 'solved', m.now_n) FROM mvp m WHERE m.class_id = k.id),
        'growth', (SELECT jsonb_build_object('name', g.display_name, 'gain', g.gain) FROM growth g WHERE g.class_id = k.id)
      ) ORDER BY k.sort_order, k.name)
      FROM cls k
      JOIN den ON den.id = k.id
      LEFT JOIN tot t ON t.class_id = k.id
      LEFT JOIN stars s ON s.class_id = k.id
    ), '[]'::jsonb),
    'rounds', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'round', rd.r, 'start', rd.r_start, 'end', rd.r_end,
        'finished', rd.r_end < v_today,
        'winner', CASE WHEN rd.r_end < v_today THEN (SELECT w.winner FROM round_winner w WHERE w.r = rd.r) END,
        'avgs', (SELECT jsonb_object_agg(rc.class_id, rc.avg) FROM round_class rc WHERE rc.r = rd.r)
      ) ORDER BY rd.r)
      FROM rounds rd
    ), '[]'::jsonb),
    -- Cumulative per-head average at the end of each day, for the chart.
    'daily', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'day', dd.day,
        'avgs', (
          SELECT jsonb_object_agg(k.id, ROUND(
            (SELECT COUNT(*) FROM sv WHERE sv.class_id = k.id AND sv.day <= dd.day)::numeric / den.d, 2))
          FROM cls k JOIN den ON den.id = k.id
        )
      ) ORDER BY dd.day)
      FROM days dd
    ), '[]'::jsonb)
  ) INTO v_board;

  IF v_uid IS NOT NULL THEN
    SELECT jsonb_build_object(
      'class_id', (SELECT p.class_id FROM public.contest_participants p WHERE p.contest_id = c.id AND p.user_id = v_uid),
      'solved', (SELECT COUNT(*) FROM public.contest_scored_solves(c.id) sv WHERE sv.user_id = v_uid)::int,
      'solved_today', (SELECT COUNT(*) FROM public.contest_scored_solves(c.id) sv WHERE sv.user_id = v_uid AND sv.day = v_today)::int,
      'teacher_class_ids', COALESCE((
        SELECT jsonb_agg(t.class_id)
        FROM public.contest_teachers t JOIN public.contest_classes k ON k.id = t.class_id
        WHERE k.contest_id = c.id AND t.user_id = v_uid
      ), '[]'::jsonb)
    ) INTO v_mine;
  END IF;

  RETURN v_board || jsonb_build_object('mine', v_mine);
END;
$$;

REVOKE ALL ON FUNCTION public.contest_board() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.contest_board() TO anon, authenticated;

-- ---------------------------------------------------------------------
-- STEP 5 — joining with a code
-- ---------------------------------------------------------------------

-- What a code opens, for the "파이썬 기초 1반에 참가할까요?" check. A wrong
-- code is recorded; after five in a minute every code is refused for that
-- minute, so codes can't be found by trying.
CREATE OR REPLACE FUNCTION public.contest_lookup(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid    UUID := auth.uid();
  v_code   TEXT := public.contest_normalize_code(p_code);
  v_fails  INT;
  v_kind   TEXT;
  k        public.contest_classes%ROWTYPE;
  c        public.contests%ROWTYPE;
  v_joined RECORD;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'pyquests_login_required' USING ERRCODE = 'insufficient_privilege';
  END IF;

  DELETE FROM public.contest_code_attempts WHERE tried_at < NOW() - INTERVAL '1 day';
  SELECT COUNT(*) INTO v_fails FROM public.contest_code_attempts
  WHERE user_id = v_uid AND tried_at > NOW() - INTERVAL '1 minute';
  IF v_fails >= 5 THEN
    RETURN jsonb_build_object('error', 'wait');
  END IF;

  SELECT * INTO k FROM public.contest_classes WHERE student_code = v_code;
  IF FOUND THEN
    v_kind := 'student';
  ELSE
    SELECT * INTO k FROM public.contest_classes WHERE teacher_code = v_code;
    IF FOUND THEN v_kind := 'teacher'; END IF;
  END IF;

  IF v_kind IS NULL THEN
    INSERT INTO public.contest_code_attempts (user_id) VALUES (v_uid);
    RETURN jsonb_build_object('error', CASE WHEN v_fails + 1 >= 5 THEN 'wait' ELSE 'not_found' END);
  END IF;

  SELECT * INTO c FROM public.contests WHERE id = k.contest_id;
  IF public.kst_today() > c.ends_on THEN
    RETURN jsonb_build_object('error', 'ended', 'contest_name', c.name);
  END IF;

  SELECT p.class_id, kc.name INTO v_joined
  FROM public.contest_participants p JOIN public.contest_classes kc ON kc.id = p.class_id
  WHERE p.contest_id = c.id AND p.user_id = v_uid;

  RETURN jsonb_build_object(
    'kind', v_kind,
    'class_id', k.id, 'class_name', k.name, 'teacher_name', k.teacher_name,
    'contest_name', c.name, 'starts_on', c.starts_on, 'ends_on', c.ends_on,
    'joined_class_id', v_joined.class_id, 'joined_class_name', v_joined.name
  );
END;
$$;

REVOKE ALL ON FUNCTION public.contest_lookup(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.contest_lookup(TEXT) TO authenticated;

-- Join with a code. A student code needs the real name (shown to that
-- class's teacher and the admin only); a teacher code needs none. Joining
-- the same class again just updates the name; another class is refused --
-- only a teacher or the admin can take a student out.
CREATE OR REPLACE FUNCTION public.contest_join(p_code TEXT, p_real_name TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid    UUID := auth.uid();
  v_info   JSONB;
  v_class  UUID;
  v_name   TEXT := btrim(COALESCE(p_real_name, ''));
BEGIN
  v_info := public.contest_lookup(p_code);
  IF v_info ? 'error' THEN
    RETURN v_info;
  END IF;
  v_class := (v_info->>'class_id')::uuid;

  IF v_info->>'kind' = 'teacher' THEN
    INSERT INTO public.contest_teachers (class_id, user_id) VALUES (v_class, v_uid)
    ON CONFLICT DO NOTHING;
    RETURN v_info || jsonb_build_object('ok', true);
  END IF;

  IF char_length(v_name) NOT BETWEEN 1 AND 20 THEN
    RETURN jsonb_build_object('error', 'name');
  END IF;

  IF v_info->>'joined_class_id' IS NOT NULL AND (v_info->>'joined_class_id')::uuid <> v_class THEN
    RETURN v_info || jsonb_build_object('error', 'other_class');
  END IF;

  INSERT INTO public.contest_participants (contest_id, class_id, user_id, real_name)
  SELECT k.contest_id, k.id, v_uid, v_name FROM public.contest_classes k WHERE k.id = v_class
  ON CONFLICT (contest_id, user_id) DO UPDATE SET real_name = EXCLUDED.real_name;

  RETURN v_info || jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.contest_join(TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.contest_join(TEXT, TEXT) TO authenticated;

-- ---------------------------------------------------------------------
-- STEP 6 — the teacher's roster ("우리 반 현황")
-- ---------------------------------------------------------------------

-- One class, with real names: each student's scoring solves (the client
-- works out today / this round / streak / last solve from them), how many
-- problems are in their 오답노트, and how many answer codes they opened
-- during the contest.
CREATE OR REPLACE FUNCTION public.contest_roster(p_class_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  k public.contest_classes%ROWTYPE;
  c public.contests%ROWTYPE;
BEGIN
  IF NOT public.contest_can_manage(p_class_id) THEN
    RAISE EXCEPTION 'pyquests_not_teacher' USING ERRCODE = 'insufficient_privilege';
  END IF;

  SELECT * INTO k FROM public.contest_classes WHERE id = p_class_id;
  SELECT * INTO c FROM public.contests WHERE id = k.contest_id;

  RETURN jsonb_build_object(
    'class', jsonb_build_object(
      'id', k.id, 'name', k.name, 'teacher_name', k.teacher_name, 'capacity', k.capacity,
      'cheer', k.cheer, 'student_code', k.student_code
    ),
    'contest', jsonb_build_object(
      'id', c.id, 'name', c.name, 'starts_on', c.starts_on, 'ends_on', c.ends_on, 'today', public.kst_today()
    ),
    'students', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'user_id', p.user_id,
        'real_name', p.real_name,
        'display_name', pr.display_name,
        'joined_at', p.joined_at,
        'solves', COALESCE((
          SELECT jsonb_agg(jsonb_build_object('problem_id', sv.problem_id, 'solved_at', sv.solved_at) ORDER BY sv.solved_at)
          FROM public.contest_scored_solves(c.id) sv WHERE sv.user_id = p.user_id
        ), '[]'::jsonb),
        'review_count', (SELECT COUNT(*) FROM public.user_review_problems r WHERE r.user_id = p.user_id)::int,
        'answer_views', (
          SELECT COUNT(*) FROM public.user_answer_views v
          WHERE v.user_id = p.user_id
            AND (v.viewed_at AT TIME ZONE 'Asia/Seoul')::date BETWEEN c.starts_on AND c.ends_on
        )::int
      ) ORDER BY p.real_name, p.joined_at)
      FROM public.contest_participants p
      JOIN public.profiles pr ON pr.id = p.user_id
      WHERE p.class_id = k.id
    ), '[]'::jsonb)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.contest_roster(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.contest_roster(UUID) TO authenticated;

-- 정원 and the one-line cheer on the home board.
CREATE OR REPLACE FUNCTION public.contest_update_class(p_class_id UUID, p_capacity INT, p_cheer TEXT)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.contest_can_manage(p_class_id) THEN
    RAISE EXCEPTION 'pyquests_not_teacher' USING ERRCODE = 'insufficient_privilege';
  END IF;
  UPDATE public.contest_classes
  SET capacity = p_capacity, cheer = NULLIF(btrim(COALESCE(p_cheer, '')), '')
  WHERE id = p_class_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.contest_remove_participant(p_class_id UUID, p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.contest_can_manage(p_class_id) THEN
    RAISE EXCEPTION 'pyquests_not_teacher' USING ERRCODE = 'insufficient_privilege';
  END IF;
  DELETE FROM public.contest_participants WHERE class_id = p_class_id AND user_id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.contest_rename_participant(p_class_id UUID, p_user_id UUID, p_real_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.contest_can_manage(p_class_id) THEN
    RAISE EXCEPTION 'pyquests_not_teacher' USING ERRCODE = 'insufficient_privilege';
  END IF;
  UPDATE public.contest_participants SET real_name = btrim(p_real_name)
  WHERE class_id = p_class_id AND user_id = p_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.contest_update_class(UUID, INT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contest_remove_participant(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contest_rename_participant(UUID, UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.contest_update_class(UUID, INT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.contest_remove_participant(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.contest_rename_participant(UUID, UUID, TEXT) TO authenticated;

-- ---------------------------------------------------------------------
-- STEP 7 — admin (대회 관리)
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.contest_require_admin()
RETURNS VOID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'pyquests_admin_only' USING ERRCODE = 'insufficient_privilege';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.contest_require_admin() FROM PUBLIC, anon, authenticated;

-- Every contest, newest first, with both codes of each class.
CREATE OR REPLACE FUNCTION public.contest_admin_list()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.contest_require_admin();
  RETURN COALESCE((
    SELECT jsonb_agg(jsonb_build_object(
      'id', c.id, 'name', c.name, 'starts_on', c.starts_on, 'ends_on', c.ends_on,
      'languages', to_jsonb(c.languages), 'difficulties', to_jsonb(c.difficulties),
      'classes', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'id', k.id, 'name', k.name, 'teacher_name', k.teacher_name, 'capacity', k.capacity,
          'student_code', k.student_code, 'teacher_code', k.teacher_code,
          'participants', (SELECT COUNT(*) FROM public.contest_participants p WHERE p.class_id = k.id)::int,
          'teachers', (SELECT COUNT(*) FROM public.contest_teachers t WHERE t.class_id = k.id)::int
        ) ORDER BY k.sort_order, k.name)
        FROM public.contest_classes k WHERE k.contest_id = c.id
      ), '[]'::jsonb)
    ) ORDER BY c.starts_on DESC, c.created_at DESC)
    FROM public.contests c
  ), '[]'::jsonb);
END;
$$;

-- p_classes: [{"name": "파이썬 기초 1반", "teacher_name": "김OO", "capacity": 22}, …]
CREATE OR REPLACE FUNCTION public.contest_create(
  p_name TEXT,
  p_starts_on DATE,
  p_ends_on DATE,
  p_classes JSONB,
  p_languages TEXT[] DEFAULT ARRAY['python'],
  p_difficulties TEXT[] DEFAULT ARRAY['basic', 'intermediate']
)
RETURNS UUID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_id  UUID;
  v_row JSONB;
  v_i   INT := 0;
BEGIN
  PERFORM public.contest_require_admin();
  IF jsonb_array_length(COALESCE(p_classes, '[]'::jsonb)) < 2 THEN
    RAISE EXCEPTION 'pyquests_contest_needs_two_classes' USING ERRCODE = 'check_violation';
  END IF;

  INSERT INTO public.contests (name, starts_on, ends_on, languages, difficulties)
  VALUES (btrim(p_name), p_starts_on, p_ends_on, p_languages, p_difficulties)
  RETURNING id INTO v_id;

  FOR v_row IN SELECT * FROM jsonb_array_elements(p_classes) LOOP
    INSERT INTO public.contest_classes (contest_id, name, teacher_name, capacity, student_code, teacher_code, sort_order)
    VALUES (
      v_id,
      btrim(v_row->>'name'),
      NULLIF(btrim(COALESCE(v_row->>'teacher_name', '')), ''),
      NULLIF(v_row->>'capacity', '')::int,
      public.contest_new_code(),
      public.contest_new_code(),
      v_i
    );
    v_i := v_i + 1;
  END LOOP;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.contest_update_contest(p_contest_id UUID, p_name TEXT, p_starts_on DATE, p_ends_on DATE)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.contest_require_admin();
  UPDATE public.contests SET name = btrim(p_name), starts_on = p_starts_on, ends_on = p_ends_on
  WHERE id = p_contest_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.contest_admin_update_class(p_class_id UUID, p_name TEXT, p_teacher_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.contest_require_admin();
  UPDATE public.contest_classes
  SET name = btrim(p_name), teacher_name = NULLIF(btrim(COALESCE(p_teacher_name, '')), '')
  WHERE id = p_class_id;
END;
$$;

-- p_kind: 'student' | 'teacher'. A new teacher code also signs every
-- teacher out of the class -- that's the point when the old one leaked.
CREATE OR REPLACE FUNCTION public.contest_regenerate_code(p_class_id UUID, p_kind TEXT)
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_code TEXT := public.contest_new_code();
BEGIN
  PERFORM public.contest_require_admin();
  IF p_kind = 'student' THEN
    UPDATE public.contest_classes SET student_code = v_code WHERE id = p_class_id;
  ELSIF p_kind = 'teacher' THEN
    UPDATE public.contest_classes SET teacher_code = v_code WHERE id = p_class_id;
    DELETE FROM public.contest_teachers WHERE class_id = p_class_id;
  ELSE
    RAISE EXCEPTION 'pyquests_bad_code_kind: %', p_kind USING ERRCODE = 'check_violation';
  END IF;
  RETURN v_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.contest_delete(p_contest_id UUID)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.contest_require_admin();
  DELETE FROM public.contests WHERE id = p_contest_id;
END;
$$;

REVOKE ALL ON FUNCTION public.contest_admin_list() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contest_create(TEXT, DATE, DATE, JSONB, TEXT[], TEXT[]) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contest_update_contest(UUID, TEXT, DATE, DATE) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contest_admin_update_class(UUID, TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contest_regenerate_code(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contest_delete(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.contest_admin_list() TO authenticated;
GRANT EXECUTE ON FUNCTION public.contest_create(TEXT, DATE, DATE, JSONB, TEXT[], TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.contest_update_contest(UUID, TEXT, DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.contest_admin_update_class(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.contest_regenerate_code(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.contest_delete(UUID) TO authenticated;

-- ---------------------------------------------------------------------
-- STEP 8 — 모두의 트리 (Christmas week)
-- ---------------------------------------------------------------------
-- How many accounts solved at least one new problem each Korean day, for the
-- last two weeks. A count only -- no names, no ids.

CREATE OR REPLACE VIEW public.daily_solvers_public AS
  SELECT
    (s.solved_at AT TIME ZONE 'Asia/Seoul')::date AS day,
    COUNT(DISTINCT s.user_id)::int AS solvers
  FROM public.user_solved_problems s
  JOIN public.profiles pr ON pr.id = s.user_id
  WHERE pr.hidden = false
    AND s.merged = false
    AND s.solved_at >= NOW() - INTERVAL '14 days'
  GROUP BY 1;

GRANT SELECT ON public.daily_solvers_public TO anon, authenticated;
