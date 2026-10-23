// Display order for multiple-choice options.
//
// The answer keys were mostly written with the correct option first (132 of
// 144 guide quiz questions, 37 of 76 quiz problems), so "always pick the
// first one" scored far above chance. Rather than re-author every question,
// options are shown in a shuffled order that is fixed per question -- the
// same seed always gives the same order, so a student who reloads sees the
// same layout and stored answers (original indices) still line up.
//
// Answers are stored and graded by ORIGINAL index; only rendering uses this.

function hash(seed: string): number {
  // FNV-1a, 32-bit
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Original option indices in the order they should be displayed. */
export function optionOrder(count: number, seed: string): number[] {
  const order = Array.from({ length: count }, (_, i) => i);
  let state = hash(seed) || 1;
  // Fisher-Yates with a small xorshift PRNG seeded from the question.
  for (let i = count - 1; i > 0; i--) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const j = (state >>> 0) % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
