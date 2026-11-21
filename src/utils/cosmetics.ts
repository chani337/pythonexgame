// Titles (칭호) and name colors, unlocked by total XP. The equipped ones are
// stored on profiles (title_id, name_color) and shown in the ranking.
//
// The unlock thresholds live twice: here for the picker, and in
// public.cosmetic_min_xp() (migrations/004_cosmetics.sql), which a trigger
// uses to refuse an equip the XP doesn't cover. tests/cosmetics.test.ts
// keeps the two in sync.
import type { CSSProperties } from 'react';

export interface Title {
  id: string;
  icon: string;
  name: string;
  minXp: number;
}

export const TITLES: Title[] = [
  { id: 'newbie', icon: '🌱', name: '새싹 코더', minXp: 0 },
  { id: 'learner', icon: '📘', name: '꾸준한 학습자', minXp: 200 },
  { id: 'bughunter', icon: '🐞', name: '버그 사냥꾼', minXp: 500 },
  { id: 'alchemist', icon: '⚗️', name: '코드 연금술사', minXp: 800 },
  { id: 'explorer', icon: '🧭', name: '알고리즘 탐험가', minXp: 1400 },
  { id: 'senior', icon: '💎', name: '시니어 러너', minXp: 2000 },
  { id: 'architect', icon: '🏛️', name: '코드 설계자', minXp: 3000 },
  { id: 'hacker', icon: '💠', name: '다이아 해커', minXp: 4000 },
  { id: 'legend', icon: '🐉', name: '전설의 코더', minXp: 5500 },
  { id: 'grandmaster', icon: '👑', name: '그랜드 마스터', minXp: 7000 },
];

export interface NameColor {
  id: string;
  name: string;
  // A plain color, or a gradient painted through the text.
  color: string;
  gradient?: string;
  minXp: number;
}

// No stored color (null) means the default near-black.
export const NAME_COLORS: NameColor[] = [
  { id: 'forest', name: '숲 초록', color: '#1a7f37', minXp: 200 },
  { id: 'ocean', name: '바다 파랑', color: '#0969da', minXp: 800 },
  { id: 'amber', name: '호박 금색', color: '#b08800', minXp: 1400 },
  { id: 'violet', name: '보라', color: '#8250df', minXp: 2000 },
  { id: 'ruby', name: '루비', color: '#cf222e', minXp: 4000 },
  { id: 'aurora', name: '오로라', color: '#8250df', gradient: 'linear-gradient(90deg, #8250df, #0969da, #1a7f37)', minXp: 7000 },
];

export const titleById = (id?: string | null) => TITLES.find((t) => t.id === id) ?? null;
export const nameColorById = (id?: string | null) => NAME_COLORS.find((c) => c.id === id) ?? null;

/** Inline style for a display name in the equipped color. */
export function nameStyle(colorId?: string | null): CSSProperties {
  const c = nameColorById(colorId);
  if (!c) return { color: '#1a1a1a' };
  if (c.gradient) {
    return { color: c.color, background: c.gradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' };
  }
  return { color: c.color };
}
