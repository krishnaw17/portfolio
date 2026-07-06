import { useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  ariaLabel?: string;
  external?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const baseClass =
  'relative inline-flex items-center justify-center gap-2 rounded-full font-medium select-none transition-colors duration-300 ease-smooth will-change-transform';

const sizeMap: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[15px]',
  lg: 'h-14 px-8 text-base',
};

const variantMap: Record<Variant, string> = {
  primary:
    'bg-fg text-bg hover:bg-white shadow-[0_10px_40px_-12px_rgba(255,255,255,0.4)]',
  secondary:
    'bg-bg-tertiary text-fg border border-line hover:border-fg/30 hover:bg-bg-secondary',
  ghost: 'text-fg hover:bg-white/5',
};

export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
  external,
  icon,
  iconRight,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 20, mass: 0.4 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    x.set(dx);
    y.set(dy);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <>
      {variant === 'primary' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
        >
          <span className="absolute -inset-1 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer" />
        </span>
      )}
      {icon && <span className="relative z-10 inline-flex items-center">{icon}</span>}
      <span className="relative z-10 inline-flex items-center">{children}</span>
      {iconRight && <span className="relative z-10 inline-flex items-center">{iconRight}</span>}
    </>
  );

  const classNames = cn(baseClass, sizeMap[size], variantMap[variant], 'group', className);

  if (href) {
    return (
      <motion.div
        ref={ref}
        style={{ x: sx, y: sy }}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className="inline-block"
      >
        <a
          href={href}
          aria-label={ariaLabel}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className={classNames}
        >
          {inner}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="inline-block"
    >
      <button type="button" aria-label={ariaLabel} onClick={onClick} className={classNames}>
        {inner}
      </button>
    </motion.div>
  );
}
