-- =====================================================================
-- 001 — Ranking integrity
-- =====================================================================
-- Closes the leaderboard manipulation hole and moves streak/solved_count
-- from client-reported values to server-derived ones.
--
-- Apply the steps IN ORDER. Steps 1-6 are safe to apply before the matching
-- client deploy; STEP 7 MUST NOT be applied until the new client is live
-- (it narrows user_solved_problems SELECT, which today's client still reads
-- directly for the activity feed). See docs/migrations/001-ranking-integrity.md.
--
-- Every step is idempotent -- re-running the file is safe.
-- =====================================================================


-- ---------------------------------------------------------------------
-- STEP 0 — Pre-flight. Read the output before continuing.
-- ---------------------------------------------------------------------
-- Rows whose problem_id does not exist in the shipped problem set. These
-- are either manipulation or problems that were renamed/retired. STEP 3
-- quarantines them; look at them first so you know which it is.

-- (run after STEP 1 has seeded public.problems -- see the doc)


-- ---------------------------------------------------------------------
-- STEP 1 — Reference table for problem ids
-- ---------------------------------------------------------------------
-- The canonical problem list lives in src/data/problems.ts. This table is
-- its database mirror, so the FK in STEP 3 can reject ids that don't exist.
-- Seed/refresh it with migrations/problems_seed.sql (npm run sync:problems).

CREATE TABLE IF NOT EXISTS public.problems (
  id         TEXT PRIMARY KEY,
  language   TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  type       TEXT NOT NULL,
  synced_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.problems IS
  'Mirror of src/data/problems.ts. Regenerate the seed with `npm run sync:problems`; never edit by hand.';

-- Readable by everyone (it is already in the client bundle), writable by
-- nobody but the service role running the seed.
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.problems FROM anon, authenticated;
GRANT SELECT ON public.problems TO anon, authenticated;
GRANT ALL ON public.problems TO service_role;

DROP POLICY IF EXISTS "problems_select_public" ON public.problems;
CREATE POLICY "problems_select_public" ON public.problems
  FOR SELECT USING (true);
-- No INSERT/UPDATE/DELETE policy: with RLS on, that means clients cannot
-- write at all. service_role bypasses RLS and runs the seed.


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
-- STEP 3 — Quarantine invalid problem_ids, then add the FK
-- ---------------------------------------------------------------------
-- This is the step that actually closes the exploit: once problem_id must
-- exist in public.problems, the highest reachable solved_count is the real
-- problem count (377 today) -- identical to a player who legitimately
-- finished everything. Inventing ids stops working entirely.
--
-- Requires public.problems to be seeded first (migrations/problems_seed.sql).

CREATE TABLE IF NOT EXISTS public.quarantined_solved_problems (
  id              UUID PRIMARY KEY,
  user_id         UUID NOT NULL,
  problem_id      TEXT NOT NULL,
  solved_at       TIMESTAMPTZ,
  quarantined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason          TEXT NOT NULL
);

ALTER TABLE public.quarantined_solved_problems ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.quarantined_solved_problems FROM anon, authenticated;
GRANT ALL ON public.quarantined_solved_problems TO service_role;

COMMENT ON TABLE public.quarantined_solved_problems IS
  'Rows removed from user_solved_problems because problem_id did not exist in public.problems. Kept so a rename can be replayed instead of losing real progress.';

-- Move, don't delete.
INSERT INTO public.quarantined_solved_problems (id, user_id, problem_id, solved_at, reason)
SELECT s.id, s.user_id, s.problem_id, s.solved_at, 'problem_id not in public.problems'
FROM public.user_solved_problems s
WHERE NOT EXISTS (SELECT 1 FROM public.problems p WHERE p.id = s.problem_id)
ON CONFLICT (id) DO NOTHING;

DELETE FROM public.user_solved_problems s
WHERE NOT EXISTS (SELECT 1 FROM public.problems p WHERE p.id = s.problem_id);

-- Same for the review list (private data, but the same class of garbage).
DELETE FROM public.user_review_problems r
WHERE NOT EXISTS (SELECT 1 FROM public.problems p WHERE p.id = r.problem_id);

ALTER TABLE public.user_solved_problems
  DROP CONSTRAINT IF EXISTS user_solved_problems_problem_id_fkey;
ALTER TABLE public.user_solved_problems
  ADD CONSTRAINT user_solved_problems_problem_id_fkey
  FOREIGN KEY (problem_id) REFERENCES public.problems(id) ON DELETE RESTRICT;

ALTER TABLE public.user_review_problems
  DROP CONSTRAINT IF EXISTS user_review_problems_problem_id_fkey;
ALTER TABLE public.user_review_problems
  ADD CONSTRAINT user_review_problems_problem_id_fkey
  FOREIGN KEY (problem_id) REFERENCES public.problems(id) ON DELETE RESTRICT;

-- ON DELETE RESTRICT, not CASCADE: retiring a problem must not silently
-- delete people's progress. problems_seed.sql refuses to drop a referenced
-- problem for the same reason.


-- ---------------------------------------------------------------------
-- STEP 4 — Server-computed streak / last_solved_date / solved_count
-- ---------------------------------------------------------------------

-- Consecutive days (Asia/Seoul) with at least one solve, counted back from
-- the most recent solve day. Returns 0 once that day is older than
-- yesterday; "yesterday" rather than "today" so the streak does not appear
-- to reset every morning before the first solve of the day.
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
    WHERE s.user_id = p_user_id
      AND (s.solved_at AT TIME ZONE 'Asia/Seoul')::date <= (SELECT d FROM today)
  ),
  ranked AS (
    SELECT d, ROW_NUMBER() OVER (ORDER BY d DESC) AS rn FROM solve_days
  ),
  newest AS (
    SELECT MAX(d) AS last_day FROM solve_days
  )
  -- Days are distinct and descending, so rn increases by exactly 1 while an
  -- unbroken run's dates fall by exactly 1. The equality below therefore
  -- holds for precisely the contiguous run ending at last_day, and fails for
  -- every row after the first gap.
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

-- Recomputes the derived profile columns for every user touched by the
-- statement. Statement-level with a transition table rather than FOR EACH
-- ROW so a bulk merge (merge_guest_progress) costs one recompute per user
-- instead of one per inserted row.
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
           (SELECT COUNT(*) FROM public.user_solved_problems s WHERE s.user_id = u.id) AS cnt,
           (SELECT TO_CHAR(MAX(s.solved_at AT TIME ZONE 'Asia/Seoul'), 'YYYY-MM-DD')
              FROM public.user_solved_problems s WHERE s.user_id = u.id) AS last_day
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

-- Backfill every existing profile from its real solve rows.
DO $$
BEGIN
  PERFORM set_config('pyquests.trusted_stats_write', 'on', true);

  UPDATE public.profiles p
  SET streak           = public.calculate_streak(p.id),
      solved_count     = COALESCE((SELECT COUNT(*) FROM public.user_solved_problems s WHERE s.user_id = p.id), 0),
      last_solved_date = (SELECT TO_CHAR(MAX(s.solved_at AT TIME ZONE 'Asia/Seoul'), 'YYYY-MM-DD')
                            FROM public.user_solved_problems s WHERE s.user_id = p.id);

  PERFORM set_config('pyquests.trusted_stats_write', 'off', true);
END
$$;


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
-- STEP 6 — Views: exclude hidden accounts, add a public activity feed
-- ---------------------------------------------------------------------

CREATE OR REPLACE VIEW public.leaderboard_public AS
  SELECT
    p.id,
    p.display_name,
    p.streak,
    p.solved_count
  FROM public.profiles p
  WHERE p.hidden = false;

-- solved_count is now a trigger-maintained column, so the GROUP BY subquery
-- that used to live here (added to dodge PostgREST's 1000-row cap when the
-- client counted rows itself) is no longer needed -- one row per profile
-- either way, and no aggregate per refresh.

GRANT SELECT ON public.leaderboard_public TO anon, authenticated;

-- Lets the dashboard activity feed work without granting anon a direct read
-- of every row of user_solved_problems. Replaces two client round-trips
-- (raw rows, then a display_name lookup per row) with one, and hides the
-- user_id entirely -- the feed only ever renders a name and a problem title.
CREATE OR REPLACE VIEW public.recent_activity_public AS
  SELECT
    s.problem_id,
    s.solved_at,
    p.display_name
  FROM public.user_solved_problems s
  JOIN public.profiles p ON p.id = s.user_id
  WHERE p.hidden = false
  ORDER BY s.solved_at DESC
  LIMIT 50;

GRANT SELECT ON public.recent_activity_public TO anon, authenticated;

COMMENT ON VIEW public.recent_activity_public IS
  'Last 50 solves with display_name only, no user_id. Exists so user_solved_problems does not need a public SELECT policy.';


-- ---------------------------------------------------------------------
-- STEP 7 — Narrow GRANTs and the public SELECT policy
-- ---------------------------------------------------------------------
-- !! DO NOT APPLY UNTIL THE NEW CLIENT IS DEPLOYED !!
-- The current client reads user_solved_problems directly for the activity
-- feed, as an anonymous visitor, every 8 seconds. Applying this before the
-- client switches to recent_activity_public silently empties that feed.

-- Replace blanket GRANT ALL with the operations the client actually performs.
REVOKE ALL ON public.profiles                 FROM anon, authenticated;
REVOKE ALL ON public.user_solved_problems     FROM anon, authenticated;
REVOKE ALL ON public.user_read_chapters       FROM anon, authenticated;
REVOKE ALL ON public.user_review_problems     FROM anon, authenticated;
REVOKE ALL ON public.user_quiz_answers        FROM anon, authenticated;
REVOKE ALL ON public.board_posts              FROM anon, authenticated;

-- anon reads nothing directly -- only the two public views, which run with
-- the view owner's privileges and so need no table grant here.
GRANT SELECT, INSERT, UPDATE ON public.profiles             TO authenticated;
GRANT SELECT, INSERT         ON public.user_solved_problems  TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.user_read_chapters    TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.user_review_problems  TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_quiz_answers     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.board_posts   TO authenticated;

GRANT ALL ON public.profiles, public.user_solved_problems, public.user_read_chapters,
             public.user_review_problems, public.user_quiz_answers, public.board_posts
  TO service_role;

-- No DELETE for authenticated on user_solved_problems: nothing in the client
-- un-solves a problem, and withholding it means a compromised session cannot
-- wipe someone's progress. Account deletion goes through the FK cascade from
-- profiles instead.

-- Scope the solved-rows read to the owner. The leaderboard and activity feed
-- both go through views now.
DROP POLICY IF EXISTS "solved_select_public" ON public.user_solved_problems;
DROP POLICY IF EXISTS "solved_select_own" ON public.user_solved_problems;
CREATE POLICY "solved_select_own" ON public.user_solved_problems
  FOR SELECT USING (auth.uid() = user_id);

-- Nothing in the client updates a solved row (insert-only, unique per
-- user+problem), so drop the UPDATE policy rather than leave it open.
DROP POLICY IF EXISTS "solved_update_own" ON public.user_solved_problems;


-- ---------------------------------------------------------------------
-- STEP 8 — merge_guest_progress RPC (used by backlog item 7)
-- ---------------------------------------------------------------------
-- One call instead of N inserts: filters ids against public.problems, sets
-- the rate-limit bypass, and upserts. Added here because the rate limit in
-- STEP 5 would otherwise reject a legitimate guest-progress merge.

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

COMMENT ON FUNCTION public.merge_guest_progress(TEXT[]) IS
  'Merges a guest localStorage solve list into the caller''s account. Filters unknown problem ids, bypasses the per-minute insert limit, and reports rows actually added (not ids supplied) so a repeat login reports 0.';
