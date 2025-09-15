// lib/mail.ts
export async function sendBookingEmail({
    to, subject, html, icsContent,
  }: { to: string; subject: string; html: string; icsContent?: string }) {
    // TODO: integrate your email provider (Resend, SendGrid, SES, etc.)
    // For now, just log so you can see payloads during dev.
    console.log('Email ->', { to, subject });
    if (icsContent) console.log('ICS length:', icsContent.length);
  }
  