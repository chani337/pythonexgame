-- ---------------------------------------------------------------------
-- STEP 5 — Insert rate limit
-- ---------------------------------------------------------------------
-- Secondary defence. The FK in STEP 3 already caps the reachable total, so
-- this is about stopping write-flood abuse of the database rather than
-- stopping rank inflation.
--
-- 30/minute = one solve every 2 seconds sustained. The fastest legitimate
-- pattern is a student clicking through quiz/fill problems they already
-- know, which measures at roughly 4-6 seconds each including the result
-- screen, so 30 leaves better than 2x headroom. Bulk merges go through
-- merge_guest_progress(), which sets the bypass flag below.

CREATE OR REPLACE FUNCTION public.enforce_solve_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  recent INT;
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


-- ---------------------------------------------------------------------
