import 'dotenv/config';
import express from 'express';
import path from 'path';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { authenticate, authorize, generateToken, comparePassword, hashPassword } from './auth.js';
import { contactLimiter, authLimiter, apiLimiter } from './rate-limiter.js';
import {
  readContent,
  updateSection,
  addItem,
  updateItem,
  deleteItem,
  initializeIfEmpty,
  writeResumeFile,
} from './data-store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.CONTACT_PORT || 3001);

const ownerEmail   = process.env.CONTACT_TO_EMAIL   || 'krishnawadhwa2@gmail.com';
const resendApiKey = process.env.RESEND_API_KEY;

// Always use onboarding@resend.dev — the pre-verified Resend sandbox sender.
// If you own a custom domain, add RESEND_FROM_EMAIL=you@yourdomain.com to .env.
const resendFromEmail =
  process.env.RESEND_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';

// Admin credentials from env
const adminEmail = process.env.ADMIN_EMAIL || 'krishnawadhwa2@gmail.com';
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '';

if (!resendApiKey) {
  console.warn('[contact-server] ⚠️  RESEND_API_KEY is not set in .env');
}

if (!adminPasswordHash) {
  console.warn('[contact-server] ⚠️  ADMIN_PASSWORD_HASH is not set in .env');
  console.warn('[contact-server]    Run: node -e "import(\'bcryptjs\').then(b=>b.hash(\'yourpassword\',12).then(console.log))"');
}

// ── Allowed Origins ──────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3001')
  .split(',')
  .map((o) => o.trim());

// ── Security Headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // Let Vite / React handle CSP
    crossOriginEmbedderPolicy: false,
  })
);

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));

// ── API-Wide Rate Limiter ────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ── Request Logger ───────────────────────────────────────────────────────────
app.use('/api', (req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ── Initialize Data Store ────────────────────────────────────────────────────
initializeIfEmpty({
  site: {
    name: 'Krishna Wadhwa',
    shortName: 'Krishna',
    role: 'Software Engineer',
    email: 'krishnawadhwa2@gmail.com',
    location: 'Jaipur, India',
    social: {
      github: 'https://github.com/krishnaw17',
      linkedin: 'https://www.linkedin.com/in/krishna-wadhwa-3396a2274/',
      twitter: 'https://x.com/KRISHNAWAD48783',
    },
  },
  skills: [],
  projects: [],
  experience: [],
  education: [],
  certifications: [],
}).catch(console.error);

// ── Resend helper ─────────────────────────────────────────────────────────────
async function sendResendEmail({ to, subject, html, text, replyTo }) {
  const body = { from: resendFromEmail, to, subject, html, text };
  if (replyTo) body.reply_to = replyTo;

  const response = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend ${response.status}: ${err}`);
  }
  return response.json();
}

// ── HTML: notification to portfolio owner ─────────────────────────────────────
function ownerEmailHtml({ name, email, message }) {
  const safe = String(message)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\n/g,'<br/>');
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1f2937;">

  <tr><td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:36px 40px;text-align:center;">
    <div style="font-size:40px;margin-bottom:10px;">📬</div>
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">New Portfolio Message</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">Someone reached out via your contact form</p>
  </td></tr>

  <tr><td style="padding:36px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:22px 26px;">
        <p style="margin:0 0 14px;color:#6366f1;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Sender Details</p>
        <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;">Name</p>
        <p style="margin:0 0 16px;color:#f1f5f9;font-size:16px;font-weight:600;">${name}</p>
        <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;">Email</p>
        <a href="mailto:${email}" style="color:#818cf8;font-size:15px;text-decoration:none;">${email}</a>
      </td></tr>
    </table>

    <p style="margin:0 0 10px;color:#6366f1;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Message</p>
    <div style="background:#0f172a;border-left:3px solid #6366f1;border-radius:0 10px 10px 0;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0;color:#e2e8f0;font-size:15px;line-height:1.8;">${safe}</p>
    </div>

    <div style="text-align:center;">
      <a href="mailto:${email}?subject=Re: Your portfolio message"
         style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:600;">
        Reply to ${name} →
      </a>
    </div>
  </td></tr>

  <tr><td style="background:#0a0a0f;padding:18px 40px;text-align:center;border-top:1px solid #1f2937;">
    <p style="margin:0;color:#374151;font-size:12px;">Krishna Wadhwa · Portfolio Contact System</p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

// ── HTML: auto-reply to sender ────────────────────────────────────────────────
function autoReplyHtml({ name }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1f2937;">

  <!-- Header gradient bar -->
  <tr><td style="height:4px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa);"></td></tr>

  <!-- Hero -->
  <tr><td style="padding:44px 40px 32px;text-align:center;">
    <div style="font-size:52px;margin-bottom:16px;">👋</div>
    <h1 style="margin:0 0 8px;color:#f8fafc;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Thanks for reaching out!</h1>
    <div style="width:48px;height:3px;background:linear-gradient(90deg,#6366f1,#a78bfa);border-radius:2px;margin:16px auto 0;"></div>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:0 40px 36px;">

    <p style="margin:0 0 10px;color:#cbd5e1;font-size:17px;line-height:1.7;">
      Hello <strong style="color:#a5b4fc;">${name}</strong>,
    </p>
    <p style="margin:0 0 28px;color:#64748b;font-size:15px;line-height:1.8;">
      Thank you for contacting me. I appreciate you taking the time to reach out!
    </p>

    <!-- Status card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:12px;margin-bottom:32px;">
      <tr><td style="padding:20px 24px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:top;padding-right:14px;">
              <div style="width:36px;height:36px;background:rgba(16,185,129,0.15);border-radius:50%;text-align:center;line-height:36px;font-size:18px;">✓</div>
            </td>
            <td style="vertical-align:top;">
              <p style="margin:0 0 4px;color:#34d399;font-size:15px;font-weight:700;">Message Received</p>
              <p style="margin:0;color:#6ee7b7;font-size:13px;line-height:1.5;">I'll review it shortly and get back to you as soon as possible.</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- CTA buttons -->
    <p style="margin:0 0 14px;color:#475569;font-size:11px;text-align:center;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">Explore</p>

    <div style="text-align:center;margin-bottom:14px;">
      <a href="https://krishnawadhwa.vercel.app"
         style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:13px 36px;border-radius:50px;font-size:14px;font-weight:600;letter-spacing:0.3px;">
        🌐 Visit Portfolio
      </a>
    </div>

    <div style="text-align:center;">
      <a href="https://github.com/krishnawadhwa"
         style="display:inline-block;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.13);color:#e2e8f0;text-decoration:none;padding:11px 22px;border-radius:50px;font-size:14px;margin-right:10px;">
        🐙 GitHub
      </a>
      <a href="https://linkedin.com/in/krishnawadhwa"
         style="display:inline-block;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.13);color:#e2e8f0;text-decoration:none;padding:11px 22px;border-radius:50px;font-size:14px;">
        💼 LinkedIn
      </a>
    </div>

  </td></tr>

  <!-- Signature -->
  <tr><td style="padding:0 40px 36px;border-top:1px solid #1f2937;">
    <div style="padding-top:24px;">
      <p style="margin:0 0 4px;color:#64748b;font-size:14px;">Regards,</p>
      <p style="margin:0;color:#e2e8f0;font-size:20px;font-weight:700;">Krishna Wadhwa</p>
      <p style="margin:6px 0 0;color:#475569;font-size:13px;">Full-Stack Developer &amp; AI Enthusiast</p>
    </div>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#0a0a0f;padding:16px 40px;text-align:center;border-top:1px solid #1f2937;">
    <p style="margin:0;color:#1e293b;font-size:12px;line-height:1.6;">
      This is an automated response · Do not reply directly<br/>
      <a href="https://krishnawadhwa.vercel.app" style="color:#4f46e5;text-decoration:none;">krishnawadhwa.vercel.app</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// ── /api/contact (rate-limited) ───────────────────────────────────────────────
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  // Input length limits
  if (name.length > 100 || email.length > 254 || message.length > 5000) {
    return res.status(400).json({ message: 'Input exceeds maximum length.' });
  }

  if (!resendApiKey) {
    return res.status(500).json({ message: 'Email service is not configured.' });
  }

  const safeMessage = String(message).trim();

  // 1️⃣  Notify owner
  try {
    await sendResendEmail({
      to:      ownerEmail,
      replyTo: email,
      subject: `📬 New message from ${name} via Portfolio`,
      html:    ownerEmailHtml({ name, email, message: safeMessage }),
      text:    `New portfolio message\n\nName: ${name}\nEmail: ${email}\n\n${safeMessage}`,
    });
    console.log(`[contact-server] ✅ Owner notified about message from ${name}`);
  } catch (err) {
    console.error('[contact-server] ❌ Owner notification failed:', err.message);
    return res.status(500).json({ message: 'Failed to deliver your message. Please try again.' });
  }

  // 2️⃣  Auto-reply to sender (best-effort — requires verified domain on Resend)
  try {
    await sendResendEmail({
      to:      email,
      subject: `👋 Thanks for reaching out, ${name}!`,
      html:    autoReplyHtml({ name }),
      text:    [
        `Hello ${name},`,
        '',
        'Thank you for contacting me.',
        '',
        '✓ Message Received — I\'ll review it shortly.',
        '',
        '🌐 Portfolio : https://krishnawadhwa.vercel.app',
        '🐙 GitHub   : https://github.com/krishnawadhwa',
        '💼 LinkedIn  : https://linkedin.com/in/krishnawadhwa',
        '',
        'Regards,',
        'Krishna Wadhwa',
      ].join('\n'),
    });
    console.log(`[contact-server] ✅ Auto-reply sent to ${email}`);
  } catch (err) {
    // Auto-reply failure is non-fatal — owner was already notified.
    console.warn(`[contact-server] ⚠️  Auto-reply to ${email} failed (${err.message})`);
    console.warn('[contact-server]    → Add a verified custom domain in Resend to enable auto-replies.');
  }

  return res.status(200).json({ message: 'Message sent successfully.' });
});

// ── Public content endpoint ───────────────────────────────────────────────────
app.get('/api/content', (_req, res) => {
  const content = readContent();
  if (!content) {
    return res.status(404).json({ message: 'Content not found.' });
  }
  // Strip meta info for public consumption
  const { _meta, ...publicContent } = content;
  return res.json(publicContent);
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', from: resendFromEmail }));

// ══════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// ── POST /api/auth/login ──────────────────────────────────────────────────────
app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Check against admin credentials
  if (email !== adminEmail) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  if (!adminPasswordHash) {
    return res.status(500).json({ message: 'Admin account is not configured.' });
  }

  const valid = await comparePassword(password, adminPasswordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = generateToken({ email, role: 'admin' });
  return res.json({ token, user: { email, role: 'admin' } });
});

// ── POST /api/auth/verify ─────────────────────────────────────────────────────
app.post('/api/auth/verify', authenticate, (req, res) => {
  return res.json({ valid: true, user: req.user });
});

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES (protected)
// ══════════════════════════════════════════════════════════════════════════════

// ── GET /api/admin/content ────────────────────────────────────────────────────
app.get('/api/admin/content', authenticate, authorize('admin'), (_req, res) => {
  const content = readContent();
  if (!content) {
    return res.status(404).json({ message: 'Content not found.' });
  }
  return res.json(content);
});

// ── PUT /api/admin/content/:section ───────────────────────────────────────────
app.put('/api/admin/content/:section', authenticate, authorize('admin'), async (req, res) => {
  const { section } = req.params;
  const validSections = ['site', 'skills', 'projects', 'experience', 'education', 'certifications', 'headlineRotations'];

  if (!validSections.includes(section)) {
    return res.status(400).json({ message: `Invalid section: ${section}` });
  }

  const updated = await updateSection(section, req.body);
  if (updated === null) {
    return res.status(500).json({ message: 'Failed to update section.' });
  }

  return res.json({ message: `${section} updated.`, data: updated });
});

// ── POST /api/admin/content/:section ──────────────────────────────────────────
app.post('/api/admin/content/:section', authenticate, authorize('admin'), async (req, res) => {
  const { section } = req.params;
  const validArraySections = ['skills', 'projects', 'experience', 'education', 'certifications'];

  if (!validArraySections.includes(section)) {
    return res.status(400).json({ message: `Cannot add items to: ${section}` });
  }

  const item = await addItem(section, req.body);
  if (item === null) {
    return res.status(500).json({ message: 'Failed to add item.' });
  }

  return res.status(201).json({ message: 'Item added.', data: item });
});

// ── PUT /api/admin/content/:section/:id ───────────────────────────────────────
app.put('/api/admin/content/:section/:id', authenticate, authorize('admin'), async (req, res) => {
  const { section, id } = req.params;
  const validArraySections = ['skills', 'projects', 'experience', 'education', 'certifications'];

  if (!validArraySections.includes(section)) {
    return res.status(400).json({ message: `Cannot update items in: ${section}` });
  }

  const updated = await updateItem(section, id, req.body);
  if (updated === null) {
    return res.status(404).json({ message: 'Item not found.' });
  }

  return res.json({ message: 'Item updated.', data: updated });
});

// ── DELETE /api/admin/content/:section/:id ────────────────────────────────────
app.delete('/api/admin/content/:section/:id', authenticate, authorize('admin'), async (req, res) => {
  const { section, id } = req.params;
  const validArraySections = ['skills', 'projects', 'experience', 'education', 'certifications'];

  if (!validArraySections.includes(section)) {
    return res.status(400).json({ message: `Cannot delete items from: ${section}` });
  }

  const removed = await deleteItem(section, id);
  if (removed === null) {
    return res.status(404).json({ message: 'Item not found.' });
  }

  return res.json({ message: 'Item deleted.', data: removed });
});

// ── POST /api/admin/resume ────────────────────────────────────────────────────
app.post('/api/admin/resume', authenticate, authorize('admin'), async (req, res) => {
  const { content } = req.body ?? {};
  
  if (!content) {
    return res.status(400).json({ message: 'No file content provided.' });
  }

  try {
    await writeResumeFile(content);
    return res.json({ message: 'Resume uploaded successfully. Vercel will rebuild the site in a minute.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to upload resume.' });
  }
});

// ── POST /api/admin/change-password ───────────────────────────────────────────
app.post('/api/admin/change-password', authenticate, authorize('admin'), async (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters.' });
  }

  const valid = await comparePassword(currentPassword, adminPasswordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Current password is incorrect.' });
  }

  const newHash = await hashPassword(newPassword);
  console.log('[contact-server] 🔑 New password hash generated. Update ADMIN_PASSWORD_HASH in .env:');
  console.log(newHash);

  return res.json({
    message: 'Password hash generated. Update your .env file with the new ADMIN_PASSWORD_HASH value.',
    hash: newHash,
  });
});

// ── Serve Frontend in Production ──────────────────────────────────────────────
// This allows deploying both frontend and backend as a single Render Web Service
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// For any other route, serve the React app (Client-side routing)
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────────────────────
// In production on Vercel, the app is exported and run serverlessly.
// Locally, we still want to listen on a port for dev mode.
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`[contact-server] Listening on http://localhost:${port}`);
    console.log(`[contact-server] From   : ${resendFromEmail}`);
    console.log(`[contact-server] Owner  : ${ownerEmail}`);
    console.log(`[contact-server] Admin  : ${adminEmail}`);
  });
}

export default app;
