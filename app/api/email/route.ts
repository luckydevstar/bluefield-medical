// /app/api/email/route.ts
export const runtime = 'nodejs'; // ensure NOT edge

import { NextRequest, NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({
  region: process.env.AWS_REGION ?? 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const stripHtml = (html = '') =>
  html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export async function POST(req: NextRequest) {
  try {
    // Accept multiple common keys so you don't have to change the client much:
    const body = await req.json();
    const to: string = body.to;
    const from: string = body.from ?? process.env.MAIL_FROM ?? '';
    const subject: string = body.subject ?? 'Message';
    // Prefer messageHtml/html/message as the HTML source
    const html: string = body.messageHtml ?? body.html ?? body.message ?? '';
    // Optional explicit text; otherwise derive from HTML
    const text: string = body.messageText ?? body.text ?? stripHtml(html);
    const replyTo: string | undefined = body.replyTo ?? body.email ?? undefined; // let replies go to the requester if provided

    if (!to || !from || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, from, subject, html' },
        { status: 400 }
      );
    }

    const cmd = new SendEmailCommand({
      Source: from, // must be a VERIFIED SES identity in this region
      Destination: { ToAddresses: [to] },
      ReplyToAddresses: replyTo ? [replyTo] : undefined,
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: {
          Html: { Data: html, Charset: 'UTF-8' },
          Text: { Data: text || subject, Charset: 'UTF-8' }, // simple fallback
        },
      },
    });

    const resp = await ses.send(cmd);
    return NextResponse.json({ ok: true, messageId: resp.MessageId });
  } catch (err: any) {
    console.error('SES send failed:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Send failed' },
      { status: 500 }
    );
  }
}
