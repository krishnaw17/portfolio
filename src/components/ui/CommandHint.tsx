import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'lucide-react';
import { useUI } from '@/store/ui';

export function CommandHint() {
  const { loaded } = useUI();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => setShow(true), 2200);
    return () => clearTimeout(t);
  }, [loaded]);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => {
            const e = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
            window.dispatchEvent(e);
          }}
          className="fixed bottom-6 right-6 z-30 hidden md:flex items-center gap-2 rounded-full border border-line glass px-3 py-2 text-xs text-fg-muted transition-colors hover:border-fg/30 hover:text-fg"
        >
          <Command size={12} />
          <span>Quick search</span>
          <span className="flex gap-0.5">
            <kbd className="rounded border border-line bg-bg/50 px-1.5 py-0.5 font-mono text-[10px]">⌘</kbd>
            <kbd className="rounded border border-line bg-bg/50 px-1.5 py-0.5 font-mono text-[10px]">K</kbd>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
