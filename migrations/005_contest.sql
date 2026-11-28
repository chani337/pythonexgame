-- =====================================================================
-- 005 — 과정 대항전 (class vs class) and the Christmas tree
-- =====================================================================
-- Requires 001–004. Safe to re-run.
--
-- Two courses race for a month on new problems solved per head. Students
-- join a class with its student code, teachers get their class's roster with
-- the teacher code, and everyone (logged in or not) sees the standings on
-- the home screen.
--
-- Nothing here is readable directly: every contest table has RLS on and no
-- policy, and all access goes through the SECURITY DEFINER functions below,
-- which decide what each caller may see --
--   anyone   : contest_board()        class totals, rounds, MVP nicknames
--   student  : contest_lookup/join()  their own membership
--   teacher  : contest_roster() …     their class, with real names
--   admin    : contest_admin_*()      everything, codes included
--
-- Scoring reuses user_solved_problems (first solve per problem, server
-- time). What doesn't count, so the gauge can't be padded:
--   * solves outside the contest dates (Korean time) or outside its problem
--     scope (problems.language / difficulty),
--   * rows written by merge_guest_progress() -- guest progress carried into
--     an account, and the admin "solve everything" button -- now flagged
--     merged = true,
--   * quiz problems answered wrong before being answered right (only the
--     first pick counts; see user_quiz_misses),
--   * hidden accounts.
-- Solving after viewing the answer code already writes nothing.
-- =====================================================================

-- ---------------------------------------------------------------------
-- STEP 1 — what scoring needs from the existing tables
-- ---------------------------------------------------------------------

ALTER TABLE public.user_solved_problems ADD COLUMN IF NOT EXISTS merged BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.user_solved_problems.merged IS
  'Written by merge_guest_progress() (guest progress, admin unlock-all), not solved in the account. Left out of contest scores.';

-- Same function as before; the INSERT now flags its rows.
CREATE OR REPLACE FUNCTION public.merge_guest_progress(p_problem_ids TEXT[])
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

    WITH ins AS (
      INSERT INTO public.user_solved_problems (user_id, problem_id, merged)
      SELECT uid, pid, true FROM UNNEST(valid_ids) AS pid
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

-- First wrong pick on a quiz problem. A quiz has a handful of options, so
-- retrying until it says correct always works; for the contest only a quiz
-- answered right before any miss counts. One row per problem: the first miss.
CREATE TABLE IF NOT EXISTS public.user_quiz_misses (
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,
  missed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, problem_id)
);

-- First look at a problem's answer code. Not a penalty (a pass after it is
-- already not saved); the roster shows teachers who is stuck where.
CREATE TABLE IF NOT EXISTS public.user_answer_views (
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,
  viewed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, problem_id)
);

-- Insert-only, own rows. No UPDATE: missed_at / viewed_at would otherwise be
-- movable to after the solve.
ALTER TABLE public.user_quiz_misses ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_quiz_misses FROM anon, authenticated;
GRANT SELECT, INSERT ON public.user_quiz_misses TO authenticated;
GRANT ALL ON public.user_quiz_misses TO service_role;

DROP POLICY IF EXISTS "quiz_misses_select_own" ON public.user_quiz_misses;
CREATE POLICY "quiz_misses_select_own" ON public.user_quiz_misses
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "quiz_misses_insert_own" ON public.user_quiz_misses;
CREATE POLICY "quiz_misses_insert_own" ON public.user_quiz_misses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.user_answer_views ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_answer_views FROM anon, authenticated;
GRANT SELECT, INSERT ON public.user_answer_views TO authenticated;
GRANT ALL ON public.user_answer_views TO service_role;

DROP POLICY IF EXISTS "answer_views_select_own" ON public.user_answer_views;
CREATE POLICY "answer_views_select_own" ON public.user_answer_views
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "answer_views_insert_own" ON public.user_answer_views;
CREATE POLICY "answer_views_insert_own" ON public.user_answer_views
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS quiz_misses_known_problem ON public.user_quiz_misses;
CREATE TRIGGER quiz_misses_known_problem
  BEFORE INSERT ON public.user_quiz_misses
  FOR EACH ROW EXECUTE FUNCTION public.enforce_known_problem_id();

DROP TRIGGER IF EXISTS answer_views_known_problem ON public.user_answer_views;
CREATE TRIGGER answer_views_known_problem
  BEFORE INSERT ON public.user_answer_views
  FOR EACH ROW EXECUTE FUNCTION public.enforce_known_problem_id();

-- ---------------------------------------------------------------------
-- STEP 2 — the contest tables (no client access; see the functions)
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.contests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 40),
  starts_on    DATE NOT NULL,             -- first scoring day, Korean time
  ends_on      DATE NOT NULL,             -- last scoring day, inclusive
  -- problems.language values (the track: 'python', 'pylib', 'sql', …)
  languages    TEXT[] NOT NULL DEFAULT ARRAY['python'],
  difficulties TEXT[] NOT NULL DEFAULT ARRAY['basic', 'intermediate'],
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (ends_on >= starts_on)
);

CREATE TABLE IF NOT EXISTS public.contest_classes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id   UUID NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
  name         TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 30),
  teacher_name TEXT CHECK (char_length(teacher_name) <= 20),
  -- 수강 정원. The per-head average divides by this when set, so leaving a
  -- slow student out of the contest doesn't raise a class's average.
  capacity     INT CHECK (capacity IS NULL OR capacity BETWEEN 1 AND 500),
  student_code TEXT NOT NULL UNIQUE,
  teacher_code TEXT NOT NULL UNIQUE,
  cheer        TEXT CHECK (char_length(cheer) <= 60),
  sort_order   INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.contest_participants (
  contest_id UUID NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
  class_id   UUID NOT NULL REFERENCES public.contest_classes(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  real_name  TEXT NOT NULL CHECK (char_length(real_name) BETWEEN 1 AND 20),
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- One class per account per contest.
  PRIMARY KEY (contest_id, user_id)
);

CREATE INDEX IF NOT EXISTS contest_participants_class ON public.contest_participants (class_id);

CREATE TABLE IF NOT EXISTS public.contest_teachers (
  class_id UUID NOT NULL REFERENCES public.contest_classes(id) ON DELETE CASCADE,
  user_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (class_id, user_id)
);

-- Wrong codes, for "5 in a row, then wait a minute".
CREATE TABLE IF NOT EXISTS public.contest_code_attempts (
  user_id  UUID NOT NULL,
  tried_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contest_code_attempts_user ON public.contest_code_attempts (user_id, tried_at);

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['contests', 'contest_classes', 'contest_participants', 'contest_teachers', 'contest_code_attempts'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;

-- ---------------------------------------------------------------------
-- STEP 3 — internal helpers (not callable by clients)
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.kst_today()
RETURNS DATE
LANGUAGE sql
STABLE
AS $$
  SELECT (NOW() AT TIME ZONE 'Asia/Seoul')::date
$$;

-- Upper case, no spaces or hyphens: "py-7k2a" and "PY7K2A" are one code.
CREATE OR REPLACE FUNCTION public.contest_normalize_code(p_code TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT upper(regexp_replace(COALESCE(p_code, ''), '[[:space:]-]', '', 'g'))
$$;

-- Six characters with 0/O, 1/I/L left out so a code read off a projector
-- can't be mistyped into another one.
CREATE OR REPLACE FUNCTION public.contest_new_code()
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  alphabet CONSTANT TEXT := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v TEXT;
BEGIN
  LOOP
    v := '';
    FOR i IN 1..6 LOOP
      v := v || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.contest_classes WHERE student_code = v OR teacher_code = v
    );
  END LOOP;
  RETURN v;
END;
$$;

-- The contest the site shows: the newest one that hasn't been over for a
-- week (the week after is for the results). Upcoming ones count, so a
-- contest made in December shows its countdown and takes sign-ups.
CREATE OR REPLACE FUNCTION public.contest_current_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT id FROM public.contests
  WHERE ends_on + 7 >= public.kst_today()
  ORDER BY starts_on DESC, created_at DESC
  LIMIT 1
$$;

-- Every solve that scores for the contest, with the solver's class.
CREATE OR REPLACE FUNCTION public.contest_scored_solves(p_contest_id UUID)
RETURNS TABLE (user_id UUID, class_id UUID, problem_id TEXT, solved_at TIMESTAMPTZ, day DATE)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT cp.user_id, cp.class_id, s.problem_id, s.solved_at,
         (s.solved_at AT TIME ZONE 'Asia/Seoul')::date
  FROM public.contests c
  JOIN public.contest_participants cp ON cp.contest_id = c.id
  JOIN public.profiles pr ON pr.id = cp.user_id AND pr.hidden = false
  JOIN public.user_solved_problems s ON s.user_id = cp.user_id AND s.merged = false
  JOIN public.problems pb ON pb.id = s.problem_id
  WHERE c.id = p_contest_id
    AND (s.solved_at AT TIME ZONE 'Asia/Seoul')::date BETWEEN c.starts_on AND c.ends_on
    AND pb.language = ANY (c.languages)
    AND pb.difficulty = ANY (c.difficulties)
    AND (pb.type <> 'quiz' OR NOT EXISTS (
      SELECT 1 FROM public.user_quiz_misses m
      WHERE m.user_id = s.user_id AND m.problem_id = s.problem_id AND m.missed_at <= s.solved_at
    ))
$$;

-- The caller teaches this class, or is the admin.
CREATE OR REPLACE FUNCTION public.contest_can_manage(p_class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT public.is_admin() OR EXISTS (
    SELECT 1 FROM public.contest_teachers t
    WHERE t.class_id = p_class_id AND t.user_id = auth.uid()
  )
$$;

REVOKE ALL ON FUNCTION public.contest_new_code() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.contest_current_id() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.contest_scored_solves(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.contest_can_manage(UUID) FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------
-- STEP 4 — the public board (anyone, logged in or not)
-- ---------------------------------------------------------------------
-- Class totals only: names of classes and teachers, counts, rounds, and the
-- MVPs by site nickname. Real names never leave contest_roster().

CREATE OR REPLACE FUNCTION public.contest_board()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  c           public.contests%ROWTYPE;
  v_today     DATE := public.kst_today();
  v_last      DATE;
  v_rounds    INT;
  v_round_now INT;
  v_mvp_round INT;
  v_uid       UUID := auth.uid();
  v_board     JSONB;
  v_mine      JSONB := NULL;
BEGIN
  SELECT * INTO c FROM public.contests WHERE id = public.contest_current_id();
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  v_last := LEAST(v_today, c.ends_on);
  v_rounds := CEIL((c.ends_on - c.starts_on + 1) / 7.0)::int;
  v_round_now := CASE
    WHEN v_today < c.starts_on THEN 0
    ELSE LEAST(v_rounds, (v_last - c.starts_on) / 7 + 1)
  END;
  -- MVPs are for the round in progress, or the last one once it's over.
  v_mvp_round := v_round_now;

  WITH
  cls AS (
    SELECT k.*, (SELECT COUNT(*) FROM public.contest_participants p WHERE p.class_id = k.id)::int AS participants
    FROM public.contest_classes k
    WHERE k.contest_id = c.id
  ),
  den AS (
    SELECT id, GREATEST(COALESCE(capacity, participants), 1) AS d FROM cls
  ),
  sv AS (
    SELECT * FROM public.contest_scored_solves(c.id)
  ),
  tot AS (
    SELECT sv.class_id, COUNT(*)::int AS solved FROM sv GROUP BY sv.class_id
  ),
  per_day AS (
    SELECT sv.class_id, sv.day, COUNT(DISTINCT sv.user_id)::int AS solvers
    FROM sv GROUP BY sv.class_id, sv.day
  ),
  -- A star for each day the whole class (정원, or everyone who joined) solved.
  stars AS (
    SELECT pd.class_id, COUNT(*)::int AS stars
    FROM per_day pd JOIN den ON den.id = pd.class_id JOIN cls ON cls.id = pd.class_id
    WHERE cls.participants > 0 AND pd.solvers >= den.d
    GROUP BY pd.class_id
  ),
  rounds AS (
    SELECT r,
           c.starts_on + 7 * (r - 1) AS r_start,
           LEAST(c.starts_on + 7 * r - 1, c.ends_on) AS r_end
    FROM generate_series(1, v_rounds) AS r
  ),
  round_class AS (
    SELECT rd.r, k.id AS class_id,
           ROUND((SELECT COUNT(*) FROM sv WHERE sv.class_id = k.id AND sv.day BETWEEN rd.r_start AND rd.r_end)::numeric / den.d, 2) AS avg
    FROM rounds rd CROSS JOIN cls k JOIN den ON den.id = k.id
  ),
  round_best AS (
    SELECT rc.r, MAX(rc.avg) AS best FROM round_class rc GROUP BY rc.r
  ),
  -- A round's winner: the single class on top. A tie, or nobody solving, has none.
  round_winner AS (
    SELECT rc.r, (ARRAY_AGG(rc.class_id))[1] AS winner
    FROM round_class rc JOIN round_best b ON b.r = rc.r AND rc.avg = b.best
    WHERE b.best > 0
    GROUP BY rc.r
    HAVING COUNT(*) = 1
  ),
  cur AS (
    SELECT * FROM rounds WHERE r = v_mvp_round
  ),
  user_round AS (
    SELECT sv.class_id, sv.user_id,
           COUNT(*) FILTER (WHERE sv.day BETWEEN cur.r_start AND cur.r_end)::int AS now_n,
           COUNT(*) FILTER (WHERE sv.day BETWEEN cur.r_start - 7 AND cur.r_start - 1)::int AS prev_n
    FROM sv CROSS JOIN cur
    GROUP BY sv.class_id, sv.user_id
  ),
  mvp AS (
    SELECT DISTINCT ON (ur.class_id) ur.class_id, pr.display_name, ur.now_n
    FROM user_round ur JOIN public.profiles pr ON pr.id = ur.user_id
    WHERE ur.now_n > 0
    ORDER BY ur.class_id, ur.now_n DESC, pr.display_name
  ),
  -- 성장상: the biggest jump on the round before. None in round 1.
  growth AS (
    SELECT DISTINCT ON (ur.class_id) ur.class_id, pr.display_name, ur.now_n - ur.prev_n AS gain
    FROM user_round ur JOIN public.profiles pr ON pr.id = ur.user_id
    WHERE v_mvp_round > 1 AND ur.now_n - ur.prev_n > 0
    ORDER BY ur.class_id, ur.now_n - ur.prev_n DESC, pr.display_name
  ),
  days AS (
    SELECT d::date AS day FROM generate_series(c.starts_on, v_last, INTERVAL '1 day') AS d
  )
  SELECT jsonb_build_object(
    'contest', jsonb_build_object(
      'id', c.id, 'name', c.name, 'starts_on', c.starts_on, 'ends_on', c.ends_on,
      'today', v_today, 'rounds', v_rounds, 'round_now', v_round_now,
      'languages', to_jsonb(c.languages), 'difficulties', to_jsonb(c.difficulties)
    ),
    'classes', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', k.id, 'name', k.name, 'teacher_name', k.teacher_name,
        'capacity', k.capacity, 'participants', k.participants, 'denominator', den.d,
        'solved', COALESCE(t.solved, 0), 'stars', COALESCE(s.stars, 0), 'cheer', k.cheer,
        'today_solvers', COALESCE((SELECT pd.solvers FROM per_day pd WHERE pd.class_id = k.id AND pd.day = v_today), 0),
        'round_wins', (SELECT COUNT(*) FROM round_winner w JOIN rounds rd ON rd.r = w.r WHERE w.winner = k.id AND rd.r_end < v_today)::int,
        'mvp', (SELECT jsonb_build_object('name', m.display_name, 'solved', m.now_n) FROM mvp m WHERE m.class_id = k.id),
        'growth', (SELECT jsonb_build_object('name', g.display_name, 'gain', g.gain) FROM growth g WHERE g.class_id = k.id)
      ) ORDER BY k.sort_order, k.name)
      FROM cls k
      JOIN den ON den.id = k.id
      LEFT JOIN tot t ON t.class_id = k.id
      LEFT JOIN stars s ON s.class_id = k.id
    ), '[]'::jsonb),
    'rounds', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'round', rd.r, 'start', rd.r_start, 'end', rd.r_end,
        'finished', rd.r_end < v_today,
        'winner', CASE WHEN rd.r_end < v_today THEN (SELECT w.winner FROM round_winner w WHERE w.r = rd.r) END,
        'avgs', (SELECT jsonb_object_agg(rc.class_id, rc.avg) FROM round_class rc WHERE rc.r = rd.r)
      ) ORDER BY rd.r)
      FROM rounds rd
    ), '[]'::jsonb),
    -- Cumulative per-head average at the end of each day, for the chart.
    'daily', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'day', dd.day,
        'avgs', (
          SELECT jsonb_object_agg(k.id, ROUND(
            (SELECT COUNT(*) FROM sv WHERE sv.class_id = k.id AND sv.day <= dd.day)::numeric / den.d, 2))
          FROM cls k JOIN den ON den.id = k.id
        )
      ) ORDER BY dd.day)
      FROM days dd
    ), '[]'::jsonb)
  ) INTO v_board;

  IF v_uid IS NOT NULL THEN
    SELECT jsonb_build_object(
      'class_id', (SELECT p.class_id FROM public.contest_participants p WHERE p.contest_id = c.id AND p.user_id = v_uid),
      'solved', (SELECT COUNT(*) FROM public.contest_scored_solves(c.id) sv WHERE sv.user_id = v_uid)::int,
      'solved_today', (SELECT COUNT(*) FROM public.contest_scored_solves(c.id) sv WHERE sv.user_id = v_uid AND sv.day = v_today)::int,
      'teacher_class_ids', COALESCE((
        SELECT jsonb_agg(t.class_id)
        FROM public.contest_teachers t JOIN public.contest_classes k ON k.id = t.class_id
        WHERE k.contest_id = c.id AND t.user_id = v_uid
      ), '[]'::jsonb)
    ) INTO v_mine;
  END IF;

  RETURN v_board || jsonb_build_object('mine', v_mine);
END;
$$;

REVOKE ALL ON FUNCTION public.contest_board() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.contest_board() TO anon, authenticated;

-- ---------------------------------------------------------------------
-- STEP 5 — joining with a code
-- ---------------------------------------------------------------------

-- What a code opens, for the "파이썬 기초 1반에 참가할까요?" check. A wrong
-- code is recorded; after five in a minute every code is refused for that
-- minute, so codes can't be found by trying.
CREATE OR REPLACE FUNCTION public.contest_lookup(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid    UUID := auth.uid();
  v_code   TEXT := public.contest_normalize_code(p_code);
  v_fails  INT;
  v_kind   TEXT;
  k        public.contest_classes%ROWTYPE;
  c        public.contests%ROWTYPE;
  v_joined RECORD;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'pyquests_login_required' USING ERRCODE = 'insufficient_privilege';
  END IF;

  DELETE FROM public.contest_code_attempts WHERE tried_at < NOW() - INTERVAL '1 day';
  SELECT COUNT(*) INTO v_fails FROM public.contest_code_attempts
  WHERE user_id = v_uid AND tried_at > NOW() - INTERVAL '1 minute';
  IF v_fails >= 5 THEN
    RETURN jsonb_build_object('error', 'wait');
  END IF;

  SELECT * INTO k FROM public.contest_classes WHERE student_code = v_code;
  IF FOUND THEN
    v_kind := 'student';
  ELSE
    SELECT * INTO k FROM public.contest_classes WHERE teacher_code = v_code;
    IF FOUND THEN v_kind := 'teacher'; END IF;
  END IF;

  IF v_kind IS NULL THEN
    INSERT INTO public.contest_code_attempts (user_id) VALUES (v_uid);
    RETURN jsonb_build_object('error', CASE WHEN v_fails + 1 >= 5 THEN 'wait' ELSE 'not_found' END);
  END IF;

  SELECT * INTO c FROM public.contests WHERE id = k.contest_id;
  IF public.kst_today() > c.ends_on THEN
    RETURN jsonb_build_object('error', 'ended', 'contest_name', c.name);
  END IF;

  SELECT p.class_id, kc.name INTO v_joined
  FROM public.contest_participants p JOIN public.contest_classes kc ON kc.id = p.class_id
  WHERE p.contest_id = c.id AND p.user_id = v_uid;

  RETURN jsonb_build_object(
    'kind', v_kind,
    'class_id', k.id, 'class_name', k.name, 'teacher_name', k.teacher_name,
    'contest_name', c.name, 'starts_on', c.starts_on, 'ends_on', c.ends_on,
    'joined_class_id', v_joined.class_id, 'joined_class_name', v_joined.name
  );
END;
$$;

REVOKE ALL ON FUNCTION public.contest_lookup(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.contest_lookup(TEXT) TO authenticated;

-- Join with a code. A student code needs the real name (shown to that
-- class's teacher and the admin only); a teacher code needs none. Joining
-- the same class again just updates the name; another class is refused --
-- only a teacher or the admin can take a student out.
CREATE OR REPLACE FUNCTION public.contest_join(p_code TEXT, p_real_name TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid    UUID := auth.uid();
  v_info   JSONB;
  v_class  UUID;
  v_name   TEXT := btrim(COALESCE(p_real_name, ''));
BEGIN
  v_info := public.contest_lookup(p_code);
  IF v_info ? 'error' THEN
    RETURN v_info;
  END IF;
  v_class := (v_info->>'class_id')::uuid;

  IF v_info->>'kind' = 'teacher' THEN
    INSERT INTO public.contest_teachers (class_id, user_id) VALUES (v_class, v_uid)
    ON CONFLICT DO NOTHING;
    RETURN v_info || jsonb_build_object('ok', true);
  END IF;

  IF char_length(v_name) NOT BETWEEN 1 AND 20 THEN
    RETURN jsonb_build_object('error', 'name');
  END IF;

  IF v_info->>'joined_class_id' IS NOT NULL AND (v_info->>'joined_class_id')::uuid <> v_class THEN
    RETURN v_info || jsonb_build_object('error', 'other_class');
  END IF;

  INSERT INTO public.contest_participants (contest_id, class_id, user_id, real_name)
  SELECT k.contest_id, k.id, v_uid, v_name FROM public.contest_classes k WHERE k.id = v_class
  ON CONFLICT (contest_id, user_id) DO UPDATE SET real_name = EXCLUDED.real_name;

  RETURN v_info || jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.contest_join(TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.contest_join(TEXT, TEXT) TO authenticated;

-- ---------------------------------------------------------------------
-- STEP 6 — the teacher's roster ("우리 반 현황")
-- ---------------------------------------------------------------------

-- One class, with real names: each student's scoring solves (the client
-- works out today / this round / streak / last solve from them), how many
-- problems are in their 오답노트, and how many answer codes they opened
-- during the contest.
CREATE OR REPLACE FUNCTION public.contest_roster(p_class_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  k public.contest_classes%ROWTYPE;
  c public.contests%ROWTYPE;
BEGIN
  IF NOT public.contest_can_manage(p_class_id) THEN
    RAISE EXCEPTION 'pyquests_not_teacher' USING ERRCODE = 'insufficient_privilege';
  END IF;

  SELECT * INTO k FROM public.contest_classes WHERE id = p_class_id;
  SELECT * INTO c FROM public.contests WHERE id = k.contest_id;

  RETURN jsonb_build_object(
    'class', jsonb_build_object(
      'id', k.id, 'name', k.name, 'teacher_name', k.teacher_name, 'capacity', k.capacity,
      'cheer', k.cheer, 'student_code', k.student_code
    ),
    'contest', jsonb_build_object(
      'id', c.id, 'name', c.name, 'starts_on', c.starts_on, 'ends_on', c.ends_on, 'today', public.kst_today()
    ),
    'students', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'user_id', p.user_id,
        'real_name', p.real_name,
        'display_name', pr.display_name,
        'joined_at', p.joined_at,
        'solves', COALESCE((
          SELECT jsonb_agg(jsonb_build_object('problem_id', sv.problem_id, 'solved_at', sv.solved_at) ORDER BY sv.solved_at)
          FROM public.contest_scored_solves(c.id) sv WHERE sv.user_id = p.user_id
        ), '[]'::jsonb),
        'review_count', (SELECT COUNT(*) FROM public.user_review_problems r WHERE r.user_id = p.user_id)::int,
        'answer_views', (
          SELECT COUNT(*) FROM public.user_answer_views v
          WHERE v.user_id = p.user_id
            AND (v.viewed_at AT TIME ZONE 'Asia/Seoul')::date BETWEEN c.starts_on AND c.ends_on
        )::int
      ) ORDER BY p.real_name, p.joined_at)
      FROM public.contest_participants p
      JOIN public.profiles pr ON pr.id = p.user_id
      WHERE p.class_id = k.id
    ), '[]'::jsonb)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.contest_roster(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.contest_roster(UUID) TO authenticated;

-- 정원 and the one-line cheer on the home board.
CREATE OR REPLACE FUNCTION public.contest_update_class(p_class_id UUID, p_capacity INT, p_cheer TEXT)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.contest_can_manage(p_class_id) THEN
    RAISE EXCEPTION 'pyquests_not_teacher' USING ERRCODE = 'insufficient_privilege';
  END IF;
  UPDATE public.contest_classes
  SET capacity = p_capacity, cheer = NULLIF(btrim(COALESCE(p_cheer, '')), '')
  WHERE id = p_class_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.contest_remove_participant(p_class_id UUID, p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.contest_can_manage(p_class_id) THEN
    RAISE EXCEPTION 'pyquests_not_teacher' USING ERRCODE = 'insufficient_privilege';
  END IF;
  DELETE FROM public.contest_participants WHERE class_id = p_class_id AND user_id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.contest_rename_participant(p_class_id UUID, p_user_id UUID, p_real_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.contest_can_manage(p_class_id) THEN
    RAISE EXCEPTION 'pyquests_not_teacher' USING ERRCODE = 'insufficient_privilege';
  END IF;
  UPDATE public.contest_participants SET real_name = btrim(p_real_name)
  WHERE class_id = p_class_id AND user_id = p_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.contest_update_class(UUID, INT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contest_remove_participant(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contest_rename_participant(UUID, UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.contest_update_class(UUID, INT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.contest_remove_participant(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.contest_rename_participant(UUID, UUID, TEXT) TO authenticated;

-- ---------------------------------------------------------------------
-- STEP 7 — admin (대회 관리)
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.contest_require_admin()
RETURNS VOID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'pyquests_admin_only' USING ERRCODE = 'insufficient_privilege';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.contest_require_admin() FROM PUBLIC, anon, authenticated;

-- Every contest, newest first, with both codes of each class.
CREATE OR REPLACE FUNCTION public.contest_admin_list()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.contest_require_admin();
  RETURN COALESCE((
    SELECT jsonb_agg(jsonb_build_object(
      'id', c.id, 'name', c.name, 'starts_on', c.starts_on, 'ends_on', c.ends_on,
      'languages', to_jsonb(c.languages), 'difficulties', to_jsonb(c.difficulties),
      'classes', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'id', k.id, 'name', k.name, 'teacher_name', k.teacher_name, 'capacity', k.capacity,
          'student_code', k.student_code, 'teacher_code', k.teacher_code,
          'participants', (SELECT COUNT(*) FROM public.contest_participants p WHERE p.class_id = k.id)::int,
          'teachers', (SELECT COUNT(*) FROM public.contest_teachers t WHERE t.class_id = k.id)::int
        ) ORDER BY k.sort_order, k.name)
        FROM public.contest_classes k WHERE k.contest_id = c.id
      ), '[]'::jsonb)
    ) ORDER BY c.starts_on DESC, c.created_at DESC)
    FROM public.contests c
  ), '[]'::jsonb);
END;
$$;

-- p_classes: [{"name": "파이썬 기초 1반", "teacher_name": "김OO", "capacity": 22}, …]
CREATE OR REPLACE FUNCTION public.contest_create(
  p_name TEXT,
  p_starts_on DATE,
  p_ends_on DATE,
  p_classes JSONB,
  p_languages TEXT[] DEFAULT ARRAY['python'],
  p_difficulties TEXT[] DEFAULT ARRAY['basic', 'intermediate']
)
RETURNS UUID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_id  UUID;
  v_row JSONB;
  v_i   INT := 0;
BEGIN
  PERFORM public.contest_require_admin();
  IF jsonb_array_length(COALESCE(p_classes, '[]'::jsonb)) < 2 THEN
    RAISE EXCEPTION 'pyquests_contest_needs_two_classes' USING ERRCODE = 'check_violation';
  END IF;

  INSERT INTO public.contests (name, starts_on, ends_on, languages, difficulties)
  VALUES (btrim(p_name), p_starts_on, p_ends_on, p_languages, p_difficulties)
  RETURNING id INTO v_id;

  FOR v_row IN SELECT * FROM jsonb_array_elements(p_classes) LOOP
    INSERT INTO public.contest_classes (contest_id, name, teacher_name, capacity, student_code, teacher_code, sort_order)
    VALUES (
      v_id,
      btrim(v_row->>'name'),
      NULLIF(btrim(COALESCE(v_row->>'teacher_name', '')), ''),
      NULLIF(v_row->>'capacity', '')::int,
      public.contest_new_code(),
      public.contest_new_code(),
      v_i
    );
    v_i := v_i + 1;
  END LOOP;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.contest_update_contest(p_contest_id UUID, p_name TEXT, p_starts_on DATE, p_ends_on DATE)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.contest_require_admin();
  UPDATE public.contests SET name = btrim(p_name), starts_on = p_starts_on, ends_on = p_ends_on
  WHERE id = p_contest_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.contest_admin_update_class(p_class_id UUID, p_name TEXT, p_teacher_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.contest_require_admin();
  UPDATE public.contest_classes
  SET name = btrim(p_name), teacher_name = NULLIF(btrim(COALESCE(p_teacher_name, '')), '')
  WHERE id = p_class_id;
END;
$$;

-- p_kind: 'student' | 'teacher'. A new teacher code also signs every
-- teacher out of the class -- that's the point when the old one leaked.
CREATE OR REPLACE FUNCTION public.contest_regenerate_code(p_class_id UUID, p_kind TEXT)
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_code TEXT := public.contest_new_code();
BEGIN
  PERFORM public.contest_require_admin();
  IF p_kind = 'student' THEN
    UPDATE public.contest_classes SET student_code = v_code WHERE id = p_class_id;
  ELSIF p_kind = 'teacher' THEN
    UPDATE public.contest_classes SET teacher_code = v_code WHERE id = p_class_id;
    DELETE FROM public.contest_teachers WHERE class_id = p_class_id;
  ELSE
    RAISE EXCEPTION 'pyquests_bad_code_kind: %', p_kind USING ERRCODE = 'check_violation';
  END IF;
  RETURN v_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.contest_delete(p_contest_id UUID)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.contest_require_admin();
  DELETE FROM public.contests WHERE id = p_contest_id;
END;
$$;

REVOKE ALL ON FUNCTION public.contest_admin_list() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contest_create(TEXT, DATE, DATE, JSONB, TEXT[], TEXT[]) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contest_update_contest(UUID, TEXT, DATE, DATE) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contest_admin_update_class(UUID, TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contest_regenerate_code(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contest_delete(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.contest_admin_list() TO authenticated;
GRANT EXECUTE ON FUNCTION public.contest_create(TEXT, DATE, DATE, JSONB, TEXT[], TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.contest_update_contest(UUID, TEXT, DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.contest_admin_update_class(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.contest_regenerate_code(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.contest_delete(UUID) TO authenticated;

-- ---------------------------------------------------------------------
-- STEP 8 — 모두의 트리 (Christmas week)
-- ---------------------------------------------------------------------
-- How many accounts solved at least one new problem each Korean day, for the
-- last two weeks. A count only -- no names, no ids.

CREATE OR REPLACE VIEW public.daily_solvers_public AS
  SELECT
    (s.solved_at AT TIME ZONE 'Asia/Seoul')::date AS day,
    COUNT(DISTINCT s.user_id)::int AS solvers
  FROM public.user_solved_problems s
  JOIN public.profiles pr ON pr.id = s.user_id
  WHERE pr.hidden = false
    AND s.merged = false
    AND s.solved_at >= NOW() - INTERVAL '14 days'
  GROUP BY 1;

GRANT SELECT ON public.daily_solvers_public TO anon, authenticated;
