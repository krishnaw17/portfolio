// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
// import { TESTIMONIALS } from '@/constants/content';
// import { TextReveal } from '@/components/ui/TextReveal';
// import { useUI } from '@/store/ui';

// export function Testimonials() {
//   const [i, setI] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const { setCursor } = useUI();
//   const t = TESTIMONIALS[i];

//   useEffect(() => {
//     if (paused) return;
//     const id = setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 5500);
//     return () => clearInterval(id);
//   }, [paused]);

//   return (
//     <section className="relative py-32 md:py-48 border-t border-line">
//       <div className="container-x">
//         <div className="mb-16">
//           <div className="text-eyebrow mb-4">06 — Words from collaborators</div>
//           <TextReveal
//             as="h2"
//             text="Built with great people."
//             className="text-display text-4xl md:text-6xl tracking-tightest text-balance max-w-3xl"
//           />
//         </div>

//         <div
//           className="relative overflow-hidden rounded-3xl border border-line glass p-8 md:p-14"
//           onMouseEnter={() => setPaused(true)}
//           onMouseLeave={() => setPaused(false)}
//         >
//           <Quote className="absolute -top-2 left-6 text-fg-subtle/20" size={120} />

//           <AnimatePresence mode="wait">
//             <motion.blockquote
//               key={t.id}
//               initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
//               animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
//               exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
//               transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
//               className="relative z-10"
//             >
//               <p className="text-display text-2xl md:text-4xl tracking-tight text-fg text-balance max-w-4xl">
//                 &ldquo;{t.text}&rdquo;
//               </p>
//               <footer className="mt-8 flex items-center gap-3">
//                 <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan text-sm font-bold text-bg">
//                   {t.name
//                     .split(' ')
//                     .map((n) => n[0])
//                     .join('')}
//                 </div>
//                 <div>
//                   <div className="text-sm font-medium text-fg">{t.name}</div>
//                   <div className="text-xs text-fg-muted">
//                     {t.role} · {t.company}
//                   </div>
//                 </div>
//               </footer>
//             </motion.blockquote>
//           </AnimatePresence>

//           <div className="mt-10 flex items-center justify-between">
//             <div className="flex gap-1">
//               {TESTIMONIALS.map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setI(idx)}
//                   onMouseEnter={() => setCursor('hover', '')}
//                   onMouseLeave={() => setCursor('default')}
//                   className={`h-1 w-8 rounded-full transition-colors ${
//                     idx === i ? 'bg-fg' : 'bg-line'
//                   }`}
//                   aria-label={`Go to testimonial ${idx + 1}`}
//                 />
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setI((v) => (v - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
//                 onMouseEnter={() => setCursor('hover', '')}
//                 onMouseLeave={() => setCursor('default')}
//                 className="grid h-9 w-9 place-items-center rounded-full border border-line text-fg-muted hover:border-fg/30 hover:text-fg"
//                 aria-label="Previous"
//               >
//                 <ChevronLeft size={16} />
//               </button>
//               <button
//                 onClick={() => setI((v) => (v + 1) % TESTIMONIALS.length)}
//                 onMouseEnter={() => setCursor('hover', '')}
//                 onMouseLeave={() => setCursor('default')}
//                 className="grid h-9 w-9 place-items-center rounded-full border border-line text-fg-muted hover:border-fg/30 hover:text-fg"
//                 aria-label="Next"
//               >
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
