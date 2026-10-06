-- ---------------------------------------------------------------------
-- STEP 1 — the column, and protecting it from the client
-- ---------------------------------------------------------------------

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.is_admin IS
  'Grants support-board moderation and the admin dashboard. Write-protected: only service_role (SQL editor) can change it.';

-- Extends 001's trigger function to cover is_admin. Same approach: restore
-- the old value rather than raise, so a client that sends the whole profile
-- row back doesn't start failing.
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
  -- Without this, `update({ is_admin: true })` would grant moderation over
  -- everyone's support-board posts to anyone who asked for it.
  NEW.is_admin         := OLD.is_admin;
  RETURN NEW;
END;
$$;

-- Reads the caller's own flag. SECURITY DEFINER so it does not depend on
-- profiles' SELECT policy, and STABLE so the planner calls it once per
-- statement rather than once per row.
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

COMMENT ON FUNCTION public.is_admin() IS
  'True when the current session belongs to an admin. Used by board_posts policies in place of a hardcoded UUID.';


-- ---------------------------------------------------------------------
