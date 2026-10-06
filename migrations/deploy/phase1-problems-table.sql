-- =====================================================================
-- PyQuests 배포 1단계 — problems 참조 테이블
-- =====================================================================
-- Supabase 대시보드 → SQL Editor 에 이 파일 전체를 붙여넣고 실행하세요.
-- 실행 후 migrations/problems_seed.sql 을 이어서 실행하세요.
--
-- 001 과 002 는 어떤 행도 삭제하지 않습니다 (DELETE 문 0개).
-- 상세: docs/migrations/001-ranking-integrity.md, 002-admin-flag.md
-- =====================================================================

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
