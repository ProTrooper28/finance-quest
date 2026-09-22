import { useEffect, useRef, useState } from "react";

const EASE = [0.23, 0.86, 0.44, 1];

/**
 * Animates a number from 0 (or `from`) to `value` over `duration` ms with an
 * ease-out curve. Respects prefers-reduced-motion by snapping instantly.
 */
export function useCountUp(value, { duration = 900, delay = 0, enabled = true } = {}) {
  const [display, setDisplay] = useState(enabled ? 0 : value);
  const frame = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!enabled) {
      setDisplay(value);
      return;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let start;
    const tick = (now) => {
      if (start === undefined) start = now;
      const t = Math.min((now - start - delay) / duration, 1);
      if (t >= 0) {
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(value * eased));
      }
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration, delay, enabled]);

  return display;
}

export { EASE };
