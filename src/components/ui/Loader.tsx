import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
  onDone: () => void;
}

export function Loader({ onDone }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = 100;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // ease-out
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => setHidden(true), 400);
        setTimeout(() => onDone(), 1200);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[200] grid place-items-center bg-bg"
        >
          {/* Background grid + glow */}
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute inset-0 bg-radial-fade opacity-50" />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center"
          >
            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-10 grid h-20 w-20 place-items-center rounded-2xl glass-strong"
            >
              <span className="text-2xl font-display font-medium tracking-tightest">AC</span>
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, rgba(34,211,238,0.6) 90deg, transparent 180deg)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <span className="absolute inset-[1px] rounded-2xl bg-bg" />
              <span className="relative z-10 text-2xl font-display font-medium tracking-tightest">
                KW
              </span>
            </motion.div>

            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-fg-muted">
              Crafting experience
            </div>

            <div className="relative h-px w-64 overflow-hidden bg-line">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-blue to-accent-cyan"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            <div className="mt-3 font-mono text-xs tabular-nums text-fg-muted">
              {progress.toString().padStart(3, '0')}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
