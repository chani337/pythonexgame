-- ---------------------------------------------------------------------
-- STEP 2 — profiles: hidden flag + server-owned stat columns
-- ---------------------------------------------------------------------

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.hidden IS
  'Excluded from leaderboard_public and recent_activity_public. Use for test/admin accounts and confirmed manipulation, replacing the client-side EXCLUDED_LEADERBOARD_IDS list.';
COMMENT ON COLUMN public.profiles.streak IS
  'Server-derived. Maintained by refresh_solver_stats(); client writes are ignored.';
COMMENT ON COLUMN public.profiles.last_solved_date IS
  'Server-derived (Asia/Seoul, YYYY-MM-DD). Maintained by refresh_solver_stats(); client writes are ignored.';
COMMENT ON COLUMN public.profiles.solved_count IS
  'Server-derived. Maintained by refresh_solver_stats(); client writes are ignored.';

-- Reject client writes to the derived columns by silently restoring the old
-- values rather than raising. Erroring would break the existing signup and
-- fetchProfile upserts, which send `streak: 0` as part of a wider payload --
-- this way an outdated client keeps working while its stat values stop
-- mattering. Column-level REVOKE UPDATE was the alternative; it fails those
-- upserts with a 403 instead, which is a worse failure mode mid-rollout.
CREATE OR REPLACE FUNCTION public.protect_profile_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only the client roles are untrusted. PostgREST sets the role per request
  -- (anon / authenticated / service_role) and the Supabase SQL editor runs as
  -- postgres, so an administrator fixing a row by hand and the service_role
  -- key both still work. Without this the trigger also silently swallowed
  -- `UPDATE profiles SET hidden = true` from the SQL editor -- which is
  -- exactly how an account gets hidden.
  IF current_user NOT IN ('anon', 'authenticated') THEN
    RETURN NEW;
  END IF;

  -- refresh_solver_stats() sets this before its own UPDATE.
  IF COALESCE(current_setting('pyquests.trusted_stats_write', true), 'off') = 'on' THEN
    RETURN NEW;
  END IF;

  NEW.streak           := OLD.streak;
  NEW.last_solved_date := OLD.last_solved_date;
  NEW.solved_count     := OLD.solved_count;
  NEW.hidden           := OLD.hidden;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_protect_stats ON public.profiles;
CREATE TRIGGER profiles_protect_stats
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_stats();


-- ---------------------------------------------------------------------
