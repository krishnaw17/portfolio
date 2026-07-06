export default async function handler(req, res) {
  // CORS Headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const ownerEmail = process.env.CONTACT_TO_EMAIL || 'krishnawadhwa2@gmail.com';
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';

  if (!resendApiKey) {
    return res.status(500).json({ message: 'Email service is not configured (Missing API Key).' });
  }

  const { name, email, message } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  const safeMessage = String(message).trim();

  // Helper function to send email via Resend API
  async function sendResendEmail({ to, subject, html, text, replyTo }) {
    const body = { from: resendFromEmail, to, subject, html, text };
    if (replyTo) body.reply_to = replyTo;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
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

  // HTML Templates
  const ownerEmailHtml = `<!DOCTYPE html>
  <html lang="en">
  <body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1f2937;">
    <tr><td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:36px 40px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">New Portfolio Message</h1>
    </td></tr>
    <tr><td style="padding:36px 40px;">
      <p style="margin:0 0 8px;color:#94a3b8;">Name: <strong style="color:#fff">${name}</strong></p>
      <p style="margin:0 0 16px;color:#94a3b8;">Email: <a href="mailto:${email}" style="color:#818cf8;">${email}</a></p>
      <div style="background:#0f172a;border-left:3px solid #6366f1;padding:20px;margin-bottom:28px;">
        <p style="margin:0;color:#e2e8f0;">${safeMessage.replace(/\n/g, '<br/>')}</p>
      </div>
    </td></tr>
  </table>
  </td></tr>
  </table>
  </body></html>`;

  const autoReplyHtml = `<!DOCTYPE html>
  <html lang="en">
  <body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1f2937;">
    <tr><td style="height:4px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa);"></td></tr>
    <tr><td style="padding:44px 40px 32px;text-align:center;">
      <h1 style="margin:0 0 8px;color:#f8fafc;font-size:26px;">Thanks for reaching out!</h1>
    </td></tr>
    <tr><td style="padding:0 40px 36px;">
      <p style="color:#cbd5e1;">Hello <strong style="color:#a5b4fc;">${name}</strong>,</p>
      <p style="color:#64748b;">Thank you for contacting me. I appreciate you taking the time to reach out! I'll review it shortly and get back to you.</p>
      <div style="margin-top:30px;padding-top:20px;border-top:1px solid #1f2937;">
        <p style="margin:0;color:#e2e8f0;font-weight:700;font-size:18px;">Krishna Wadhwa</p>
        <p style="margin:0;color:#64748b;">Full-Stack Developer</p>
      </div>
    </td></tr>
  </table>
  </td></tr>
  </table>
  </body></html>`;

  // 1️⃣ Notify owner
  try {
    await sendResendEmail({
      to: ownerEmail,
      replyTo: email,
      subject: `📬 New message from ${name} via Portfolio`,
      html: ownerEmailHtml,
      text: `Name: ${name}\nEmail: ${email}\n\n${safeMessage}`,
    });
  } catch (err) {
    console.error('Owner notification failed:', err.message);
    return res.status(500).json({ message: 'Failed to deliver your message. Please try again.' });
  }

  // 2️⃣ Auto-reply to sender (best-effort)
  try {
    await sendResendEmail({
      to: email,
      subject: `👋 Thanks for reaching out, ${name}!`,
      html: autoReplyHtml,
      text: `Hello ${name},\n\nThanks for reaching out! I've received your message and will review it shortly.\n\nRegards,\nKrishna Wadhwa`,
    });
  } catch (err) {
    console.warn(`Auto-reply to ${email} failed: ${err.message}`);
  }

  return res.status(200).json({ message: 'Message sent successfully.' });
}
