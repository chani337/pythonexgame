-- Supabase Schema for PyQuests Multi-User Learning App

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

-- Each user can only read/write their OWN row directly. Public leaderboard
-- access to (id, display_name, streak) goes through the view below instead,
-- which never exposes email -- the anon key is embedded in the client
-- bundle, so anything readable without RLS is effectively public.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.profiles TO anon, authenticated, service_role, postgres;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Public-safe leaderboard view: only id/display_name/streak, no email.
-- Views run with the owner's privileges by default, so this can read
-- across all rows of the now-locked-down profiles table while only ever
-- exposing these three columns.
CREATE OR REPLACE VIEW public.leaderboard_public AS
  SELECT id, display_name, streak FROM public.profiles;

GRANT SELECT ON public.leaderboard_public TO anon, authenticated;

-- 2. User Solved Problems Table
CREATE TABLE IF NOT EXISTS public.user_solved_problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,
  solved_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_problem UNIQUE (user_id, problem_id)
);

-- No sensitive data in this table, so public read is fine (needed for the
-- leaderboard's solved-count totals), but only the owning user may write.
ALTER TABLE public.user_solved_problems ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.user_solved_problems TO anon, authenticated, service_role, postgres;

DROP POLICY IF EXISTS "solved_select_public" ON public.user_solved_problems;
CREATE POLICY "solved_select_public" ON public.user_solved_problems
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "solved_insert_own" ON public.user_solved_problems;
CREATE POLICY "solved_insert_own" ON public.user_solved_problems
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "solved_update_own" ON public.user_solved_problems;
CREATE POLICY "solved_update_own" ON public.user_solved_problems
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

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
GRANT ALL ON public.user_read_chapters TO anon, authenticated, service_role, postgres;

DROP POLICY IF EXISTS "read_chapters_own" ON public.user_read_chapters;
CREATE POLICY "read_chapters_own" ON public.user_read_chapters
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2c. User Review Problems Table (오답노트: 틀렸거나 별표 표시한 문제)
CREATE TABLE IF NOT EXISTS public.user_review_problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_review_problem UNIQUE (user_id, problem_id)
);

-- Purely private per-user data, never read publicly -- lock all operations
-- to the owning user.
ALTER TABLE public.user_review_problems ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.user_review_problems TO anon, authenticated, service_role, postgres;

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
GRANT ALL ON public.user_quiz_answers TO anon, authenticated, service_role, postgres;

DROP POLICY IF EXISTS "quiz_answers_own" ON public.user_quiz_answers;
CREATE POLICY "quiz_answers_own" ON public.user_quiz_answers
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

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
