type Mail = { to: string; subject: string; html: string; fallbackLog?: boolean };

export async function sendBookingEmail(mail: Mail) {
  // Prefer RESEND (simplest). Fallback to console in dev if no key.
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (mail.fallbackLog) {
      console.log('[MAIL:FALLBACK]', mail.subject, '\nTO:', mail.to, '\n', mail.html);
    }
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.BOOKINGS_FROM_EMAIL || 'noreply@yourdomain.com',
        to: mail.to,
        subject: mail.subject,
        html: mail.html,
      }),
    });
    if (!res.ok) {
      const j = await res.text();
      console.error('Resend error:', j);
    }
  } catch (e) {
    console.error('Mailer error', e);
  }
}
