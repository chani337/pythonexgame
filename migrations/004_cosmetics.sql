-- =====================================================================
-- 004 — Titles (칭호) and name colors, unlocked by XP
-- =====================================================================
-- Requires 003 (public.user_xp). Safe to re-run.
--
-- A user picks a title and a name color from the dashboard; the ranking
-- shows them. The client only offers what the user's XP has unlocked, but
-- the client can't be trusted with that, so a trigger re-checks every equip
-- against public.cosmetic_min_xp() and refuses a locked one.
--
-- The thresholds must match src/utils/cosmetics.ts (tests/cosmetics.test.ts
-- checks this file against it).
-- =====================================================================

-- ---------------------------------------------------------------------
-- STEP 1 — columns. NULL = nothing equipped (no title, default color).
-- ---------------------------------------------------------------------

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS title_id   TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name_color TEXT;

-- ---------------------------------------------------------------------
-- STEP 2 — the catalog and the check
-- ---------------------------------------------------------------------

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

-- ---------------------------------------------------------------------
-- STEP 3 — show them in the ranking (new columns go last)
-- ---------------------------------------------------------------------

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
