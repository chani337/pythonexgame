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

-- Disable RLS on profiles so public leaderboard can query all registered users easily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Grant ALL permissions to anon, authenticated, and service_role
GRANT ALL ON public.profiles TO anon, authenticated, service_role, postgres;

-- 2. User Solved Problems Table
CREATE TABLE IF NOT EXISTS public.user_solved_problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,
  solved_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_problem UNIQUE (user_id, problem_id)
);

-- Disable RLS on user_solved_problems so public leaderboard can query solved counts easily
ALTER TABLE public.user_solved_problems DISABLE ROW LEVEL SECURITY;

-- Grant ALL permissions to anon, authenticated, and service_role
GRANT ALL ON public.user_solved_problems TO anon, authenticated, service_role, postgres;

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
