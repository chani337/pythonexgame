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
