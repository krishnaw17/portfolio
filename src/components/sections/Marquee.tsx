import { motion } from 'framer-motion';

const ITEMS = [
  'TypeScript',
  'React 19',
  'Next.js',
  'Three.js',
  // 'WebGL',
  // 'GLSL',
  'Node.js',
  // 'Go',
  // 'Rust',
  // 'Python',
  'PostgreSQL',
  'Redis',
  // 'ClickHouse',
  // 'Kafka',
  // 'gRPC',
  // 'GraphQL',
  // 'AWS',
  // 'GCP',
  'Vercel',
  'Cloudflare',
  // 'Docker',
  // 'Kubernetes',
  // 'Terraform',
  // 'PyTorch',
  // 'LangChain',
  'OpenAI',
  'Claude Code',
  'Vector DBs',
];

export function Marquee() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <section className="relative border-y border-line py-10 overflow-hidden">
      <div className="container-x mb-6 flex items-center justify-between">
        <div className="text-eyebrow">Stack in motion</div>
        <div className="hidden md:block text-xs text-fg-muted">
          A small slice of the tools I reach for daily.
        </div>
      </div>
      <div className="relative flex w-full overflow-hidden mask-fade">
        <motion.div
          className="flex shrink-0 gap-12 pr-12"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
        >
          {loop.map((item, i) => (
            <div
              key={`${item}-${i}`}
              className="font-display text-2xl md:text-3xl tracking-tightest text-fg/40 hover:text-fg transition-colors"
            >
              {item}
              <span className="ml-12 text-fg-subtle">✦</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
