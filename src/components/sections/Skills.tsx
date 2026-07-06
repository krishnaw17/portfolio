import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SKILLS } from '@/constants/content';
import { TextReveal } from '@/components/ui/TextReveal';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/utils/cn';
import { useUI } from '@/store/ui';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'languages', label: 'Languages' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'cloud', label: 'Cloud' },
  { key: 'ai', label: 'AI / ML' },
  { key: 'databases', label: 'Databases' },
] as const;

export function Skills() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]['key']>('all');
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15, once: true });
  const { setCursor } = useUI();

  const filtered = useMemo(
    () => (filter === 'all' ? SKILLS : SKILLS.filter((s) => s.category === filter)),
    [filter],
  );

  return (
    <section id="skills" className="relative py-16 md:py-24 border-t border-line">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="text-eyebrow mb-4">02 — Skills</div>
            <TextReveal
              as="h2"
              text="A stack I trust to ship."
              className="text-display text-4xl md:text-6xl tracking-tightest text-balance"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                onMouseEnter={() => setCursor('hover', '')}
                onMouseLeave={() => setCursor('default')}
                className={cn(
                  'relative rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                  filter === c.key
                    ? 'border-fg/30 bg-fg/5 text-fg'
                    : 'border-line text-fg-muted hover:text-fg',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div ref={ref} className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.025, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-line bg-bg-secondary/40 p-5 hover:border-fg/20"
              onMouseEnter={() => setCursor('hover', '')}
              onMouseLeave={() => setCursor('default')}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-medium text-fg">{skill.name}</div>
                  <div className="text-xs uppercase tracking-widest text-fg-subtle">
                    {skill.category}
                  </div>
                </div>
                <div className="font-mono text-sm tabular-nums text-fg-muted">
                  {skill.level}
                </div>
              </div>

              <div className="h-1 w-full overflow-hidden rounded-full bg-line">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : {}}
                  transition={{ duration: 1.4, delay: 0.1 + i * 0.02, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent-blue/10 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
