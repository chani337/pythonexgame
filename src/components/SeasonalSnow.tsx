import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { isSnowEnabled, isWinterDecorSeason, SNOW_CHANGE_EVENT } from '../utils/winterEvent';

const FLAKE_COUNT = 36;

const between = (min: number, max: number) => min + Math.random() * (max - min);

// Falling snow over the whole app during the winter season. Purely
// decorative: the layer ignores pointer events, and the CSS hides it for
// prefers-reduced-motion.
export default function SeasonalSnow() {
  const [enabled, setEnabled] = useState(isSnowEnabled);

  useEffect(() => {
    const sync = () => setEnabled(isSnowEnabled());
    window.addEventListener(SNOW_CHANGE_EVENT, sync);
    return () => window.removeEventListener(SNOW_CHANGE_EVENT, sync);
  }, []);

  const flakes = useMemo(
    () =>
      Array.from({ length: FLAKE_COUNT }, () => {
        const size = between(4, 10);
        const duration = between(9, 21);
        return {
          left: `${between(0, 100)}%`,
          width: `${size}px`,
          height: `${size}px`,
          opacity: between(0.45, 0.9),
          animationDuration: `${duration}s`,
          // Negative delay starts each flake partway down, so the screen
          // isn't empty for the first few seconds.
          animationDelay: `${-between(0, duration)}s`,
          '--snow-drift': `${between(-40, 40)}px`,
        } as CSSProperties;
      }),
    [],
  );

  if (!enabled || !isWinterDecorSeason()) return null;

  return (
    <div className="snow-layer" aria-hidden="true">
      {flakes.map((style, i) => (
        <span key={i} className="snowflake" style={style} />
      ))}
    </div>
  );
}
