import { Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Sparkles, Star } from 'lucide-react';
import { HeroCanvas } from '@/components/three/HeroScene';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useUI } from '@/store/ui';
import { HEADLINE_ROTATIONS, SITE } from '@/constants/content';

export function Hero() {
  const text = useTypewriter(HEADLINE_ROTATIONS, 70, 35, 1400);
  const [mounted, setMounted] = useState(false);
  const { setCursor } = useUI();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden noise-overlay"
    >
      {/* Animated background grid */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.18] mask-fade-b" />
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.36)_0%,rgba(5,5,5,0.18)_30%,rgba(5,5,5,0.62)_100%)]" />

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        {mounted && (
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        )}
      </div>

      {/* Content — vertically centred, everything in one viewport */}
      <div className="relative z-10 container-x flex h-[100svh] flex-col justify-center py-16">
        {/* Left column — constrained so cube is always visible on the right */}
        <div className="w-full max-w-xl md:max-w-[52%]">

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-bg-secondary/60 px-3 py-1.5 text-xs backdrop-blur"
            onMouseEnter={() => setCursor('hover', '')}
            onMouseLeave={() => setCursor('default')}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-fg-muted">
              Open to engineering roles · India / Remote
            </span>
          </motion.div>

          {/* Heading — tighter clamp so 3 lines fit on screen */}
          <h1 className="text-display text-[clamp(2rem,5.5vw,4.5rem)] leading-[0.92] tracking-tightest text-balance">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
                className="block"
              >
                {SITE.name}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.12, ease: [0.83, 0, 0.17, 1] }}
                className="block text-fg-muted"
              >
                crafts
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.24, ease: [0.83, 0, 0.17, 1] }}
                className="block gradient-text-blue"
              >
                cinematic systems.
              </motion.span>
            </span>
          </h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-3 flex items-center gap-3 text-sm md:text-base text-fg-muted"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-fg-subtle">I am</span>
            <span className="relative h-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={text}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.83, 0, 0.17, 1] }}
                  className="inline-block font-display text-fg"
                >
                  {text}
                  <span className="ml-0.5 inline-block w-[2px] h-[1em] align-middle bg-accent-cyan animate-pulse" />
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-4 text-sm md:text-base text-fg-muted text-pretty leading-relaxed"
          >
            Software engineer building performant, type-safe, and cinematic web
            experiences. From distributed systems to GPU-accelerated UI — I obsess over
            craft so users feel the quality before they read a single line of text.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <MagneticButton
              href="#work"
              variant="primary"
              size="lg"
              icon={<Sparkles size={16} />}
              iconRight={<ArrowUpRight size={16} />}
            >
              See selected work
            </MagneticButton>
            <MagneticButton href="#contact" variant="secondary" size="lg">
              Get in touch
            </MagneticButton>
            <div className="ml-2 flex items-center gap-2">
              <MagneticButton
                href={SITE.social.github}
                external
                variant="ghost"
                size="md"
                ariaLabel="GitHub"
              >
                <BrandIcon name="github" size={16} />
              </MagneticButton>
              <MagneticButton
                href={SITE.social.linkedin}
                external
                variant="ghost"
                size="md"
                ariaLabel="LinkedIn"
              >
                <BrandIcon name="linkedin" size={16} />
              </MagneticButton>
            </div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-8 flex items-center gap-4"
          >
            <div className="flex flex-col gap-1 text-xs font-mono text-fg-subtle">
              <div className="flex items-center gap-2">
                <Star size={10} className="text-accent-cyan" />
                <span>Stripe · Vercel · Linear · Framer</span>
              </div>
            </div>
            <a
              href="#about"
              className="group ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:border-fg/40 hover:text-fg"
              aria-label="Scroll to about"
              onMouseEnter={() => setCursor('hover', '')}
              onMouseLeave={() => setCursor('default')}
            >
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowDown size={14} />
              </motion.span>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
