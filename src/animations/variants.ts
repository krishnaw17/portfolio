import type { Variants, Transition } from 'framer-motion';

/** Spring used everywhere: responsive, premium feel without bounce. */
export const ease: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 0.8,
};

export const easeOut: Transition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1],
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const stagger = (delay = 0.06, base = 0.1): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: delay,
      delayChildren: base,
    },
  },
});

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 1, ease: [0.83, 0, 0.17, 1] },
  },
};

export const textMask: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: 0,
    transition: { duration: 0.9, ease: [0.83, 0, 0.17, 1] },
  },
};

export const letterReveal: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { duration: 0.7, ease: [0.83, 0, 0.17, 1] } },
};

export const floatSlow: Variants = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
};
