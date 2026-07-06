import { motion } from 'framer-motion';
import { GraduationCap, Award, BookOpen } from 'lucide-react';
import { EDUCATION, CERTIFICATIONS } from '@/constants/content';
import { TextReveal } from '@/components/ui/TextReveal';
import { useInView } from '@/hooks/useInView';
import { useUI } from '@/store/ui';

function EduCard({ edu, i }: { edu: (typeof EDUCATION)[number]; i: number }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2, once: true });
  const { setCursor } = useUI();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setCursor('hover', '')}
      onMouseLeave={() => setCursor('default')}
      className="group relative overflow-hidden rounded-2xl border border-line bg-bg-secondary/40 p-6 transition-colors hover:border-fg/20"
    >
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-fg/5 text-fg">
          <GraduationCap size={18} />
        </div>
        <div className="font-mono text-xs text-fg-subtle">{edu.period}</div>
      </div>
      <div className="mt-5 text-display text-2xl tracking-tightest">{edu.institution}</div>
      <div className="text-fg-muted">
        {edu.degree} · {edu.field}
      </div>
      <p className="mt-3 text-sm text-fg-muted text-pretty">{edu.description}</p>
    </motion.div>
  );
}

function CertCard({ cert, i }: { cert: (typeof CERTIFICATIONS)[number]; i: number }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2, once: true });
  const { setCursor } = useUI();
  return (
    <motion.a
      href={cert.link ?? '#'}
      ref={ref as any}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setCursor('hover', '')}
      onMouseLeave={() => setCursor('default')}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-bg-secondary/40 p-4 transition-colors hover:border-fg/20"
    >
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-fg/5 text-fg">
        <Award size={18} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-fg">{cert.title}</div>
        <div className="text-xs text-fg-muted">{cert.issuer}</div>
      </div>
      <div className="font-mono text-xs text-fg-subtle">{cert.date}</div>
    </motion.a>
  );
}

export function Education() {
  return (
    <section className="relative py-16 md:py-24 border-t border-line">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-12">
            <div className="text-eyebrow mb-4">05 — Education &amp; credentials</div>
            <TextReveal
              as="h2"
              text="Learning never stops."
              className="text-display text-4xl md:text-6xl tracking-tightest text-balance max-w-3xl"
            />
          </div>

          <div className="lg:col-span-6">
            <div className="mb-6 flex items-center gap-2 text-eyebrow">
              <BookOpen size={12} /> Education
            </div>
            <div className="flex flex-col gap-4">
              {EDUCATION.map((e, i) => (
                <EduCard key={e.id} edu={e} i={i} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="mb-6 flex items-center gap-2 text-eyebrow">
              <Award size={12} /> Certifications
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CERTIFICATIONS.map((c, i) => (
                <CertCard key={c.id} cert={c} i={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
