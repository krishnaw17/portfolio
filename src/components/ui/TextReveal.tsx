import { motion, type Variants } from 'framer-motion';
import { stagger, fadeUp } from '@/animations/variants';
import { useInView } from '@/hooks/useInView';

interface TextRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  delay?: number;
  staggerChildren?: number;
  perWord?: boolean;
  perChar?: boolean;
}

const wordContainer: Variants = stagger(0.05, 0.05);
const wordVariants: Variants = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.83, 0, 0.17, 1] },
  },
};
const charVariants: Variants = {
  hidden: { y: '110%' },
  visible: { y: 0, transition: { duration: 0.6, ease: [0.83, 0, 0.17, 1] } },
};

export function TextReveal({
  text,
  className = '',
  as: Tag = 'h2',
  delay = 0,
  perChar = false,
  perWord = true,
}: TextRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2, once: true });

  if (perChar) {
    const chars = Array.from(text);
    return (
      <motion.div
        ref={ref}
        variants={wordContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ delayChildren: delay }}
        className={className}
      >
        <Tag className="inline-block">
          {chars.map((c, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <motion.span variants={charVariants} className="inline-block">
                {c === ' ' ? ' ' : c}
              </motion.span>
            </span>
          ))}
        </Tag>
      </motion.div>
    );
  }

  if (perWord) {
    const words = text.split(' ');
    return (
      <motion.div
        ref={ref}
        variants={wordContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ delayChildren: delay }}
        className={className}
      >
        <Tag className="inline-block">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
              <motion.span variants={wordVariants} className="inline-block">
                {w}
              </motion.span>
            </span>
          ))}
        </Tag>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      <Tag>{text}</Tag>
    </motion.div>
  );
}

export function MaskReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15, once: true });
  const variants: Variants = {
    hidden: { y: '110%' },
    visible: { y: 0, transition: { duration: 0.9, ease: [0.83, 0, 0.17, 1], delay } },
  };
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div variants={variants} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
        {children}
      </motion.div>
    </div>
  );
}

