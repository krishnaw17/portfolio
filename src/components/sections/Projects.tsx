import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '@/constants/content';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { useInView } from '@/hooks/useInView';
import { useUI } from '@/store/ui';
import { cn } from '@/utils/cn';
import type { Project } from '@/types';

function ProjectImage({ p, i }: { p: Project; i: number }) {
  // SVG visual instead of remote image — every project gets a unique signature
  const palettes = [
    ['#1e3a8a', '#22d3ee', '#0ea5e9'],
    ['#581c87', '#ec4899', '#a855f7'],
    ['#065f46', '#10b981', '#34d399'],
    ['#7c2d12', '#f97316', '#fb923c'],
    ['#831843', '#f43f5e', '#fb7185'],
    ['#0c4a6e', '#06b6d4', '#22d3ee'],
  ];
  const c = palettes[i % palettes.length];

  if (p.image) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/80 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg viewBox="0 0 600 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`g-${p.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c[0]} />
            <stop offset="50%" stopColor={c[1]} />
            <stop offset="100%" stopColor={c[2]} />
          </linearGradient>
          <radialGradient id={`r-${p.id}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={c[1]} stopOpacity="0.4" />
            <stop offset="100%" stopColor={c[0]} stopOpacity="0" />
          </radialGradient>
          <filter id={`n-${p.id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
          </filter>
        </defs>

        <rect width="600" height="400" fill="#0a0a0a" />
        <rect width="600" height="400" fill={`url(#g-${p.id})`} opacity="0.55" />
        <rect width="600" height="400" fill={`url(#r-${p.id})`} />

        {/* Wireframe grid */}
        {Array.from({ length: 12 }).map((_, idx) => (
          <line
            key={`h-${idx}`}
            x1="0"
            y1={(idx + 1) * 33}
            x2="600"
            y2={(idx + 1) * 33}
            stroke="white"
            strokeOpacity="0.05"
          />
        ))}
        {Array.from({ length: 18 }).map((_, idx) => (
          <line
            key={`v-${idx}`}
            x1={(idx + 1) * 33}
            y1="0"
            x2={(idx + 1) * 33}
            y2="400"
            stroke="white"
            strokeOpacity="0.05"
          />
        ))}

        {/* Project monogram */}
        <text
          x="40"
          y="330"
          fontSize="34"
          fontFamily="General Sans, Inter, sans-serif"
          fontWeight="600"
          fill="white"
          fillOpacity="0.95"
          letterSpacing="-1"
        >
          {p.title}
        </text>

        <rect width="600" height="400" filter={`url(#n-${p.id})`} />
      </svg>

      {/* Reflection */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/80 to-transparent" />
    </div>
  );
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { inView } = useInView<HTMLDivElement>({ threshold: 0.2, once: true });
  const { setCursor } = useUI();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 220, damping: 18 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 220, damping: 18 });
  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 1, y: 0 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onMouseEnter={() => setCursor('view', 'view')}
      style={{ perspective: 1200 }}
      className={cn(
        'group relative grid gap-8 rounded-3xl border border-line bg-bg-secondary/40 p-6 md:p-8 transition-colors hover:border-fg/20 md:grid-cols-12',
        p.featured && 'lg:min-h-[560px]',
      )}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="md:col-span-7 relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-bg"
      >
        <ProjectImage p={p} i={i} />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glareX, glareY] as MotionValue<string>[],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.25), transparent 50%)`,
            ) as any,
          }}
        />
      </motion.div>

      <div className="md:col-span-5 flex flex-col" style={{ transform: 'translateZ(40px)' }}>
        <div className="text-eyebrow mb-3">{p.category} · {p.year}</div>
        <h3 className="text-display text-3xl md:text-4xl tracking-tightest text-fg">
          {p.title}
        </h3>
        <p className="mt-3 text-fg-muted text-pretty">{p.description}</p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {p.metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-line p-2.5 sm:p-3">
              <div className="font-display text-base sm:text-lg text-fg">{m.value}</div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-fg-subtle mt-0.5 break-words">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-fg/5 px-2.5 py-0.5 text-[11px] font-mono text-fg-muted"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 flex gap-2 pt-2">
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm text-fg-muted hover:border-fg/30 hover:text-fg"
            >
              <BrandIcon name="github" size={14} /> Code
            </a>
          )}
          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-fg px-3.5 py-1.5 text-sm text-bg hover:bg-white"
            >
              Live <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  return (
    <section id="work" className="relative py-16 md:py-24 border-t border-line">
      <div className="container-x">
        <div className="flex flex-col gap-4 mb-16">
          <div className="text-eyebrow">03 — Selected work</div>
          <h2 className="text-display text-4xl md:text-6xl tracking-tightest text-balance max-w-3xl">
            Products, primitives, and platforms.
          </h2>
          <p className="max-w-2xl text-fg-muted text-pretty">
            A small selection of recent work. Each project pushed a constraint — performance,
            scale, latency, or craft — and forced a more interesting solution.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
