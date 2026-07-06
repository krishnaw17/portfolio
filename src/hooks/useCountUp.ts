import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, durationMs = 1600, start = false) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    if (!start) return;
    startTime.current = null;

    const tick = (t: number) => {
      if (startTime.current === null) startTime.current = t;
      const elapsed = t - startTime.current;
      const p = Math.min(1, elapsed / durationMs);
      // ease-out-quart
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, durationMs, start]);

  return value;
}
