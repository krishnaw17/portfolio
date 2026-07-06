import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, MapPin, Download, Check } from 'lucide-react';
import { TextReveal } from '@/components/ui/TextReveal';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { SITE } from '@/constants/content';
import { useUI } from '@/store/ui';

export function Contact() {
  const { setCursor } = useUI();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus('error');
      return;
    }
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="relative py-16 md:py-24 border-t border-line">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="text-eyebrow mb-4">07 — Get in touch</div>
            <TextReveal
              as="h2"
              text="Let’s build something memorable."
              className="text-display text-5xl md:text-7xl tracking-tightest text-balance"
            />
            <p className="mt-6 max-w-md text-fg-muted text-pretty">
              Open to software engineering roles, full stack developer roles, backend developer
              roles, and the occasional high-conviction collaboration. I respond within 24 hours.
            </p>

            <div className="mt-10 space-y-3">
              <a
                href={`mailto:${SITE.email}`}
                onMouseEnter={() => setCursor('hover', '')}
                onMouseLeave={() => setCursor('default')}
                className="group flex items-center gap-3 text-fg"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full border border-line group-hover:border-fg/30">
                  <Mail size={14} />
                </span>
                <span className="font-mono text-sm">{SITE.email}</span>
              </a>
              <div className="flex items-center gap-3 text-fg-muted">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-line">
                  <MapPin size={14} />
                </span>
                <span className="font-mono text-sm">{SITE.location}</span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <MagneticButton
                href={SITE.social.github}
                external
                variant="secondary"
                size="md"
                icon={<BrandIcon name="github" size={16} />}
              >
                GitHub
              </MagneticButton>
              <MagneticButton
                href={SITE.social.linkedin}
                external
                variant="secondary"
                size="md"
                icon={<BrandIcon name="linkedin" size={16} />}
              >
                LinkedIn
              </MagneticButton>
              <MagneticButton
                href={SITE.social.twitter}
                external
                variant="secondary"
                size="md"
                icon={<BrandIcon name="twitter" size={16} />}
              >
                Twitter
              </MagneticButton>
              <MagneticButton
                href={SITE.resumeUrl}
                external
                variant="primary"
                size="md"
                icon={<Download size={16} />}
              >
                Resume
              </MagneticButton>
            </div>
          </div>

          <div className="lg:col-span-6">
            <form
              onSubmit={submit}
              className="relative overflow-hidden rounded-3xl border border-line bg-bg-secondary/40 p-6 md:p-8"
            >
              <div className="space-y-4">
                <Field
                  label="Name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  placeholder="Jane Cooper"
                />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  placeholder="jane@company.com"
                />
                <Field
                  label="Message"
                  value={form.message}
                  onChange={(v) => setForm({ ...form, message: v })}
                  placeholder="Tell me about your project…"
                  textarea
                />
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="text-xs text-fg-subtle font-mono">
                  {status === 'error' && <span className="text-red-400">Please fill every field.</span>}
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  onMouseEnter={() => setCursor('hover', '')}
                  onMouseLeave={() => setCursor('default')}
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-fg px-6 text-[15px] font-medium text-bg transition-colors hover:bg-white disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <>Sending…</>
                  ) : status === 'success' ? (
                    <>
                      <Check size={16} /> Sent
                    </>
                  ) : (
                    <>
                      Send <Send size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 grid place-items-center bg-bg/85 backdrop-blur"
                  >
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                        className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-fg text-bg"
                      >
                        <Check size={20} />
                      </motion.div>
                      <div className="text-display text-2xl tracking-tightest">Message sent</div>
                      <p className="mt-2 text-fg-muted">
                        I&apos;ll reply within 24 hours, and you should receive an automatic confirmation email too.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        <footer className="mt-12 flex flex-col items-start gap-4 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-fg-muted">
            © {new Date().getFullYear()} {SITE.name}. Crafted with React, Three.js, and too much espresso.
          </div>
          {/* <div className="font-mono text-xs text-fg-subtle">
            Built for the long web · 60fps · a11y · SEO
          </div> */}
        </footer>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  const { setCursor } = useUI();
  return (
    <label
      className="block"
      onMouseEnter={() => setCursor('text', '')}
      onMouseLeave={() => setCursor('default')}
    >
      <div className="mb-1.5 text-xs font-mono uppercase tracking-widest text-fg-subtle">
        {label}
      </div>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="w-full resize-none rounded-2xl border border-line bg-bg/50 px-4 py-3 text-fg outline-none transition-colors placeholder:text-fg-subtle/60 focus:border-fg/40"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-line bg-bg/50 px-4 py-3 text-fg outline-none transition-colors placeholder:text-fg-subtle/60 focus:border-fg/40"
        />
      )}
    </label>
  );
}
