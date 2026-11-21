// Titles and name colors. The unlock thresholds live twice -- here for the
// picker and in migrations/004_cosmetics.sql, whose trigger refuses a
// locked equip -- so a drift would offer things the server then rejects.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { NAME_COLORS, TITLES, nameColorById, nameStyle, titleById } from '../src/utils/cosmetics';
import { TIERS } from '../src/utils/levels';

const sql = readFileSync(new URL('../migrations/004_cosmetics.sql', import.meta.url), 'utf8');

function sqlCatalog(): Map<string, number> {
  const map = new Map<string, number>();
  for (const m of sql.matchAll(/WHEN '((?:title|color):[a-z]+)'\s+THEN (\d+)/g)) map.set(m[1], Number(m[2]));
  return map;
}

describe('해금 기준', () => {
  it('서버 cosmetic_min_xp 와 같다', () => {
    const expected = new Map<string, number>([
      ...TITLES.map((t) => [`title:${t.id}`, t.minXp] as [string, number]),
      ...NAME_COLORS.map((c) => [`color:${c.id}`, c.minXp] as [string, number]),
    ]);
    expect(sqlCatalog()).toEqual(expected);
  });

  it('id 가 겹치지 않는다', () => {
    expect(new Set(TITLES.map((t) => t.id)).size).toBe(TITLES.length);
    expect(new Set(NAME_COLORS.map((c) => c.id)).size).toBe(NAME_COLORS.length);
  });

  it('0 XP 에도 칭호 하나는 열려 있고, 최고 등급에서 전부 열린다', () => {
    expect(TITLES.some((t) => t.minXp === 0)).toBe(true);
    const top = TIERS[TIERS.length - 1].minXp;
    for (const item of [...TITLES, ...NAME_COLORS]) expect(item.minXp).toBeLessThanOrEqual(top);
  });
});

describe('조회', () => {
  it('없는 id 와 null 은 null', () => {
    expect(titleById('nope')).toBeNull();
    expect(titleById(null)).toBeNull();
    expect(nameColorById(undefined)).toBeNull();
  });

  it('이름 색: 기본, 단색, 그라데이션', () => {
    expect(nameStyle(null).color).toBe('#1a1a1a');
    expect(nameStyle('ocean').color).toBe('#0969da');
    expect(nameStyle('aurora').backgroundClip).toBe('text');
  });
});
