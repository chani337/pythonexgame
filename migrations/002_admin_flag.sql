-- =====================================================================
-- 002 — Move admin identity out of the source code
-- =====================================================================
-- Requires 001 to be applied first (this replaces its
-- protect_profile_stats trigger function to also guard the new column).
--
-- Why: ADMIN_USER_ID = 'cf1c67dd-...' was hardcoded in AuthContext.tsx,
-- Board.tsx, Sidebar.tsx AND in three RLS policies on board_posts, in a
-- public repository. RLS meant the privilege itself was never exposed, but:
--   * it named the exact account worth attacking,
--   * two test-account UUIDs leaked alongside it, and
--   * changing who the admin is required editing RLS policies, not data.
--
-- Chosen approach: a boolean column on profiles, not a separate admins table.
--   profiles.is_admin  — one indexed PK lookup from a SECURITY DEFINER
--                        helper; nothing else to secure; the existing
--                        write-protection trigger extends to cover it.
--   public.admins      — would add granted_at/granted_by provenance and room
--                        for multiple privilege levels, at the cost of
--                        another table with its own RLS to get right.
-- For a single-admin personal project the column wins. If a second
-- privilege level ever appears (e.g. a moderator who can answer the support
-- board but not see stats), switch then -- is_admin() is the only thing the
-- policies depend on, so it is a contained change.
--
-- APPLY ORDER MATTERS: STEP 2 grants the flag to the current admin, and
-- STEP 3 makes the policies depend on it. Running STEP 3 first would lock
-- the admin out of the support board until STEP 2 ran.
-- =====================================================================


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
-- STEP 2 — grant the flag BEFORE the policies start depending on it
-- ---------------------------------------------------------------------

UPDATE public.profiles
SET is_admin = true
WHERE id = 'cf1c67dd-2b5e-4f86-9a0b-d0dda805f3da';

-- Carry over the accounts that the client-side EXCLUDED_LEADERBOARD_IDS list
-- was hiding, so the list can be deleted from the source. 001 added `hidden`
-- and made both public views filter on it.
UPDATE public.profiles
SET hidden = true
WHERE id IN (
  'cf1c67dd-2b5e-4f86-9a0b-d0dda805f3da',  -- admin
  '5eb2fb93-7238-4f04-90b5-8d5706fd4c01',  -- '히히' (rksk252539) test account
  'b14d9a0d-93df-42b6-81f0-b195f4c0795d'   -- '비밀' test account
);

-- Confirm before continuing. Expect one admin row and three hidden rows.
SELECT
  COUNT(*) FILTER (WHERE is_admin) AS admins,
  COUNT(*) FILTER (WHERE hidden)   AS hidden_accounts
FROM public.profiles;


-- ---------------------------------------------------------------------
-- STEP 3 — replace the hardcoded UUID in the board policies
-- ---------------------------------------------------------------------

DROP POLICY IF EXISTS "board_select_own_or_admin" ON public.board_posts;
CREATE POLICY "board_select_own_or_admin" ON public.board_posts
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "board_update_own_or_admin" ON public.board_posts;
CREATE POLICY "board_update_own_or_admin" ON public.board_posts
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "board_delete_own_or_admin" ON public.board_posts;
CREATE POLICY "board_delete_own_or_admin" ON public.board_posts
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin());
