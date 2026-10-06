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
CREATE OR REPLACE VIEW public.leaderboard_public AS
  SELECT
    p.id,
    p.display_name,
    p.streak,
    p.solved_count
  FROM public.profiles p
  WHERE p.hidden = false;

GRANT SELECT ON public.leaderboard_public TO anon, authenticated;

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
      INSERT INTO public.user_solved_problems (user_id, problem_id)
      SELECT uid, pid FROM UNNEST(valid_ids) AS pid
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
