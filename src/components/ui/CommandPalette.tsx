import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Mail, ArrowRight } from 'lucide-react';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { SITE } from '@/constants/content';

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  shortcut?: string[];
  action: () => void;
}

const sections = [
  { id: 'hero', label: 'Go to top' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Selected work' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = useMemo(() => {
    const nav = sections.map((s) => ({
      id: `goto-${s.id}`,
      label: s.label,
      hint: 'Jump to section',
      icon: <ArrowRight size={14} />,
      action: () => {
        document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setOpen(false);
      },
    }));

    const social: CommandItem[] = [
      {
        id: 'gh',
        label: 'Open GitHub',
        icon: <BrandIcon name="github" size={14} />,
        action: () => {
          window.open(SITE.social.github, '_blank');
          setOpen(false);
        },
      },
      {
        id: 'li',
        label: 'Open LinkedIn',
        icon: <BrandIcon name="linkedin" size={14} />,
        action: () => {
          window.open(SITE.social.linkedin, '_blank');
          setOpen(false);
        },
      },
      {
        id: 'tw',
        label: 'Open Twitter / X',
        icon: <BrandIcon name="twitter" size={14} />,
        action: () => {
          window.open(SITE.social.twitter, '_blank');
          setOpen(false);
        },
      },
      {
        id: 'mail',
        label: `Email ${SITE.email}`,
        icon: <Mail size={14} />,
        action: () => {
          window.location.href = `mailto:${SITE.email}`;
          setOpen(false);
        },
      },
    ];

    return [...nav, ...social];
  }, []);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [query, items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
    else setQuery('');
    setActive(0);
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(filtered.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filtered[active]?.action();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150]"
        >
          <div
            className="absolute inset-0 bg-bg/70 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-32 -translate-x-1/2 w-[min(640px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-line glass-strong"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Command size={14} className="text-fg-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search, jump, or open…"
                className="flex-1 bg-transparent text-fg outline-none placeholder:text-fg-subtle"
              />
              <span className="rounded-md border border-line px-1.5 py-0.5 text-[10px] font-mono text-fg-muted">
                ESC
              </span>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-fg-muted">
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filtered.map((item, i) => (
                  <button
                    key={item.id}
                    onMouseEnter={() => setActive(i)}
                    onClick={item.action}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      i === active ? 'bg-white/5 text-fg' : 'text-fg-muted'
                    }`}
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-md bg-fg/5 text-fg">
                      {item.icon}
                    </span>
                    <span className="flex-1 text-sm">{item.label}</span>
                    {item.hint && (
                      <span className="text-[10px] uppercase tracking-widest text-fg-subtle">
                        {item.hint}
                      </span>
                    )}
                    {i === active && <ArrowRight size={14} className="text-fg-muted" />}
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-line px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-fg-subtle">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>⌘K toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
