import { motion } from 'framer-motion';
import { EXPERIENCE } from '@/constants/content';
import { TextReveal } from '@/components/ui/TextReveal';
import { useInView } from '@/hooks/useInView';
import { useUI } from '@/store/ui';

function TimelineItem({
  exp,
  index,
}: {
  exp: (typeof EXPERIENCE)[number];
  index: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2, once: true });
  const { setCursor } = useUI();
  const isLast = index === EXPERIENCE.length - 1;

  return (
    <div ref={ref} className="relative grid gap-6 md:grid-cols-12 pb-12">
      {/* Left column: company + period */}
      <div className="md:col-span-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="md:sticky md:top-32"
        >
          <div className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
            {exp.period}
          </div>
          <div className="mt-2 text-display text-2xl md:text-3xl tracking-tightest text-fg">
            {exp.company}
          </div>
          <div className="text-fg-muted">{exp.role}</div>
          <div className="mt-2 text-xs font-mono text-fg-subtle">{exp.location}</div>
        </motion.div>
      </div>

      {/* Spine */}
      <div className="hidden md:flex md:col-span-1 justify-center">
        <div className="relative h-full">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top' }}
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-line via-line to-transparent"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="sticky top-1/2 mt-4 h-3 w-3 -translate-x-1/2 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan ring-4 ring-bg"
            style={{ boxShadow: '0 0 30px 0 rgba(34, 211, 238, 0.5)' }}
          />
        </div>
      </div>

      {/* Right column: content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="md:col-span-7"
        onMouseEnter={() => setCursor('hover', '')}
        onMouseLeave={() => setCursor('default')}
      >
        <p className="text-fg-muted text-pretty">{exp.description}</p>

        <ul className="mt-6 space-y-3">
          {exp.achievements.map((a) => (
            <li key={a} className="flex gap-3 text-fg">
              <span className="mt-2 h-px w-4 shrink-0 bg-accent-cyan" />
              <span className="text-pretty">{a}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {exp.technologies.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line bg-bg-secondary/50 px-2.5 py-0.5 text-[11px] font-mono text-fg-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>

      {!isLast && <div className="md:hidden h-px w-full bg-line" />}
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="relative py-16 md:py-24 border-t border-line">
      <div className="container-x">
        <div className="mb-16">
          <div className="text-eyebrow mb-4">04 — Experience</div>
          <TextReveal
            as="h2"
            text="A timeline of shipped work."
            className="text-display text-4xl md:text-6xl tracking-tightest text-balance max-w-3xl"
          />
        </div>

        <div className="flex flex-col">
          {EXPERIENCE.map((exp, i) => (
            <TimelineItem key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
