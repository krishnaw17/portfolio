import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useScrollY } from '@/hooks/useScroll';
import { MagneticButton } from './MagneticButton';

const NAV_ITEMS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const scrollY = useScrollY();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('#hero');

  // Hide-on-scroll-down
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    if (scrollY > lastY && scrollY > 120) setHidden(true);
    else setHidden(false);
    setLastY(scrollY);
  }, [scrollY, lastY]);

  // Active section observer
  useEffect(() => {
    const ids = ['#hero', '#about', '#work', '#skills', '#experience', '#contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: '-40% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.querySelector(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrollY > 24 ? 'pt-3' : 'pt-6',
        )}
      >
        <div className="container-x">
          <div
            className={cn(
              'mx-auto flex h-12 items-center justify-between rounded-full border px-3 transition-all duration-500',
              scrollY > 24
                ? 'glass-strong max-w-3xl'
                : 'border-transparent bg-transparent max-w-6xl',
            )}
          >
            <a
              href="#hero"
              className="flex items-center gap-2 pl-2 pr-3 text-sm font-display font-medium tracking-tight"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-fg text-bg text-[11px] font-bold">
                KW
              </span>
              <span className="hidden sm:inline text-fg/90">Krishna Wadhwa</span>
            </a>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-3 py-1.5 text-sm transition-colors',
                    active === item.href ? 'text-fg' : 'text-fg-muted hover:text-fg',
                  )}
                >
                  {active === item.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/5"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="#contact"
                className="hidden md:inline-flex h-8 items-center rounded-full bg-fg px-4 text-[13px] font-medium text-bg hover:bg-white"
              >
                Let&apos;s talk
              </a>
              <button
                onClick={() => setOpen((v) => !v)}
                className="md:hidden grid h-8 w-8 place-items-center rounded-full border border-line text-fg"
                aria-label="Toggle menu"
              >
                {open ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-bg/80 backdrop-blur-xl" onClick={() => setOpen(false)} />
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-20 mx-6 rounded-3xl glass-strong p-6"
            >
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      onClick={() => setOpen(false)}
                      href={item.href}
                      className="block rounded-2xl px-4 py-3 text-2xl font-display tracking-tight text-fg hover:bg-white/5"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-line pt-6">
                <MagneticButton href="#contact" size="md" className="w-full">
                  Let&apos;s talk
                </MagneticButton>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
