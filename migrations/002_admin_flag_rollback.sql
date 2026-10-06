-- =====================================================================
-- 002 — Move admin identity out of the source code : ROLLBACK
-- =====================================================================
-- Put the hardcoded UUID back in the policies, then drop the helper.
-- The is_admin column is left in place (harmless, and dropping it would
-- lose the grant) -- uncomment STEP 3 to remove it as well.

-- STEP 1 — policies back to the literal UUID
DROP POLICY IF EXISTS "board_select_own_or_admin" ON public.board_posts;
CREATE POLICY "board_select_own_or_admin" ON public.board_posts
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = 'cf1c67dd-2b5e-4f86-9a0b-d0dda805f3da');

DROP POLICY IF EXISTS "board_update_own_or_admin" ON public.board_posts;
CREATE POLICY "board_update_own_or_admin" ON public.board_posts
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = 'cf1c67dd-2b5e-4f86-9a0b-d0dda805f3da')
  WITH CHECK (auth.uid() = user_id OR auth.uid() = 'cf1c67dd-2b5e-4f86-9a0b-d0dda805f3da');

DROP POLICY IF EXISTS "board_delete_own_or_admin" ON public.board_posts;
CREATE POLICY "board_delete_own_or_admin" ON public.board_posts
  FOR DELETE USING (auth.uid() = user_id OR auth.uid() = 'cf1c67dd-2b5e-4f86-9a0b-d0dda805f3da');

-- STEP 2 — restore 001's trigger function (without the is_admin guard)
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

DROP FUNCTION IF EXISTS public.is_admin();

-- STEP 3 — (optional) drop the column
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_admin;
