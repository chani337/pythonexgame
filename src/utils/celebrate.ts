import confetti from 'canvas-confetti';
import { isWinterDecorSeason } from './winterEvent';

// Rendered once and reused: shapeFromText draws each emoji to a canvas.
// undefined = not tried yet, null = this browser couldn't make them.
let winterShapes: confetti.Shape[] | null | undefined;

function getWinterShapes(): confetti.Shape[] | null {
  if (winterShapes === undefined) {
    try {
      winterShapes = ['❄️', '🎄', '⭐'].map((text) => confetti.shapeFromText({ text, scalar: 2 }));
    } catch {
      winterShapes = null;
    }
  }
  return winterShapes;
}

/** The correct-answer burst: snowflakes and trees in the winter season, regular confetti otherwise. */
export function celebrate(particleCount: number, spread: number): void {
  const origin = { y: 0.6 };
  if (!isWinterDecorSeason()) {
    confetti({ particleCount, spread, origin });
    return;
  }
  const shapes = getWinterShapes();
  if (shapes) {
    confetti({
      particleCount: Math.round(particleCount * 0.6),
      spread,
      origin,
      shapes,
      scalar: 2,
      gravity: 0.6,
      ticks: 260,
    });
  } else {
    confetti({ particleCount, spread, origin, colors: ['#ffffff', '#c0262d', '#1a6b3c', '#e8b923'] });
  }
}
