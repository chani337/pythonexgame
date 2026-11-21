import confetti from 'canvas-confetti';
import { isWinterDecorSeason } from './winterEvent';

// Pale blues read as snow on the white page; red, green and gold as Christmas.
const WINTER_COLORS = ['#b9d4ee', '#7fb3e0', '#c0262d', '#1a6b3c', '#e8b923'];

/** The correct-answer burst: winter colors in the winter season, regular confetti otherwise. */
export function celebrate(particleCount: number, spread: number): void {
  const origin = { y: 0.6 };
  if (!isWinterDecorSeason()) {
    confetti({ particleCount, spread, origin });
    return;
  }
  // Built-in shapes only: emoji shapes (shapeFromText) smear into shreds as
  // they tumble and left white patches over the page.
  confetti({ particleCount, spread, origin, colors: WINTER_COLORS, shapes: ['circle', 'star'], scalar: 1.1 });
}
