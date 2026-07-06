import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMedia } from '@/hooks/useMedia';
import { useUI } from '@/store/ui';

export function Cursor() {
  const isTouch = useMedia('(pointer: coarse)');
  const { cursorVariant, cursorText } = useUI();

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 250, damping: 28, mass: 0.5 });
  const ringY = useSpring(dotY, { stiffness: 180, damping: 24, mass: 0.6 });

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTouch) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [isTouch, dotX, dotY]);

  if (!enabled) return null;

  const variants: Record<typeof cursorVariant, { size: number; opacity: number; mix: string }> = {
    default: { size: 8, opacity: 1, mix: 'difference' },
    hover: { size: 56, opacity: 0.6, mix: 'difference' },
    text: { size: 4, opacity: 1, mix: 'difference' },
    view: { size: 80, opacity: 0.7, mix: 'difference' },
  };
  const v = variants[cursorVariant];

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{
          x: dotX,
          y: dotY,
          mixBlendMode: v.mix as any,
        }}
        animate={{
          width: v.size,
          height: v.size,
          opacity: v.opacity,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30"
        style={{
          x: ringX,
          y: ringY,
          width: 32,
          height: 32,
          mixBlendMode: 'difference',
        }}
      />
      {cursorText && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-bg"
          style={{
            x: dotX,
            y: dotY,
          }}
          transition={{ type: 'spring', stiffness: 250, damping: 22 }}
        >
          {cursorText}
        </motion.div>
      )}
    </>
  );
}
