export const runtime = 'nodejs'; // ensure NOT edge

import { NextRequest, NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({
  region: process.env.AWS_REGION ?? 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,       // keep these server-side only
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function POST(req: NextRequest) {
  try {
    const { to, from, subject, message } = await req.json();

    const cmd = new SendEmailCommand({
      Source: from, // must be a verified identity in the SES region
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: { Text: { Data: message, Charset: 'UTF-8' } }
      }
    });

    const resp = await ses.send(cmd);
    return NextResponse.json({ messageId: resp.MessageId });
  } catch (err: any) {
    console.error('SES send failed:', err);
    return NextResponse.json({ error: err?.message ?? 'Send failed' }, { status: 500 });
  }
}
