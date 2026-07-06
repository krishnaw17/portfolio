import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SITE } from '@/constants/content';
import { TextReveal } from '@/components/ui/TextReveal';

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="about" ref={sectionRef} className="relative py-16 md:py-24">
      <div className="container-x">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <div className="text-eyebrow mb-4">01 — About</div>
              <TextReveal
                as="h2"
                text="A craftsman with systems thinking."
                className="text-display text-4xl md:text-5xl tracking-tightest text-balance"
              />
            </div>
          </div>

          <div className="lg:col-span-8">
            <motion.div style={{ y }} className="space-y-6 text-lg md:text-xl text-fg-muted text-pretty">
              <p>
                I build products that scale. Crafting elegant solutions
                at the intersection of design, engineering, and artificial intelligence.
              </p>
              <p>
                I treat frontend as a <span className="text-fg">systems problem</span>: the
                bundle, the runtime, the paint, the perceived speed. The result is software
                that disappears into the experience — fast, type-safe, accessible, and
                obsessively detailed.
              </p>
              <p>
                Currently based in {SITE.location}. When I&apos;m not shipping, I write about
                distributed systems, sketch interface ideas, and chase the perfect espresso.
              </p>
            </motion.div>


            <div className="mt-12 flex flex-wrap gap-2">
              {['TypeScript', 'Javascript', 'C', 'C++', 'React', 'Three.js', 'Node.js', 'PostgreSQL', 'Express.js', 'MongoDB', 'Redis'].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line bg-bg-secondary/50 px-3 py-1 text-xs text-fg-muted"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
