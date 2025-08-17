import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from "sonner"
import { isEmail } from '@/src/utils/email';
import { esc } from '@/src/utils/email';

export interface HeroData {
  title: string;
  subtitle: string;
  image: {
    key: string;
    url: string;
  };
  destination_email: string;
}

interface HeroViewProps {
  data: HeroData;
}

export function ContactUsHeroView({ data }: HeroViewProps) {
  const [content, setContent] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const toEmail = data.destination_email ?? 'info@bluefields.uk';

  const handleSubmit = async () => {
    if (!email || !name || !phone) {
      toast.info("You inputs are invalid.")

      return;
    }

    if (!isEmail(email)) {
      toast.info("Email type is invalid.");

      return;
    }

    const safeMessage = esc(content ?? '').replace(/\r?\n/g, '<br>');

    const emailContent = `<!doctype html><html><body style="margin:0;background:#f6f9fc;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f6f9fc;padding:24px 0;">
        <tr>
          <td align="center" style="padding:0 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:600px;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
              <tr>
                <td style="background:#111827;color:#ffffff;padding:18px 24px;font-weight:700;font-size:18px;">
                  New contact message
                </td>
              </tr>
              <tr>
                <td style="padding:24px;color:#111827;">
                  <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">You’ve received a new message from your website.</p>
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #e5e7eb;border-radius:12px;">
                    <tr>
                      <td style="width:110px;color:#6b7280;font-size:13px;padding:10px 12px;border-bottom:1px solid #f3f4f6;">Contact</td>
                      <td style="font-size:14px;padding:10px 12px;border-bottom:1px solid #f3f4f6;">${esc(name)}, <a href="mailto:${esc(email)}" style="color:#111827;text-decoration:underline;">${esc(email)}</a>${phone ? `, <a href="tel:${esc(phone)}" style="color:#111827;text-decoration:underline;">${esc(phone)}</a>` : ''}</td>
                    </tr>
                    <tr>
                      <td style="width:110px;color:#6b7280;font-size:13px;padding:10px 12px;border-bottom:1px solid #f3f4f6;">Reason</td>
                      <td style="font-size:14px;padding:10px 12px;border-bottom:1px solid #f3f4f6;">${esc(reason ?? '')}</td>
                    </tr>
                    <tr>
                      <td style="width:110px;color:#6b7280;font-size:13px;padding:10px 12px;">Message</td>
                      <td style="font-size:14px;padding:10px 12px;">${safeMessage}</td>
                    </tr>
                  </table>
                  <p style="color:#6b7280;font-size:12px;margin-top:18px;">Sent via Bluefields “Contact Us” form.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body></html>`;
    const subject = `Contact request from ${name}`;

    const res = await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: toEmail,
        from: toEmail,
        subject: subject,
        message: emailContent
      })
    });

    if (res.ok) {
      toast.success("Email has been sent successfully");
      setName("");
      setEmail("");
      setPhone("");
      setReason("");
      setContent("");
    }
  }


  return (
    <section className="relative min-h-[660px] flex items-center justify-center overflow-hidden">
      <div className="mx-auto flex flex-col items-start max-w-7xl justify-between px-12 lg:px-16" aria-label="Global">
        <div className="absolute inset-0 z-0">
          <Image
            src={data.image.url}
            alt={data.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-darkblue/60" />
        </div>

        <div className='flex z-10 gap-12'>
          <div className="relative text-white max-w-4xl mx-auto px-6 hidden md:block">
            <h1 className="text-2xl md:text-4xl font-bold mb-6 leading-tight">
              {data.title}
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {data.subtitle}
            </p>
          </div>
          <div className='flex flex-col bg-white rounded-xl px-8 py-8 gap-6'>
            <h1 className='text-darkblue text-xl font-bold'>Get in Touch</h1>
            <div className='flex flex-col gap-4 max-w-lg w-full'>
              <div className='flex flex-col gap-2 w-full'>
                <Input required placeholder='Name *' size={32} className='w-full h-9' id='name' onChange={e => setName(e.target.value)} />
              </div>
              <div className='flex flex-col gap-2 w-full'>
                <Input required type="email" placeholder='Email *' size={32} className='w-full h-9' id='email' onChange={e => setEmail(e.target.value)} />
              </div>
              <div className='flex flex-col gap-2 w-full'>
                <Input required placeholder='Phone *' size={32} className='w-full h-9' id='phone' onChange={e => setPhone(e.target.value)} />
              </div>
              {/* <div className='flex gap-6 px-4'>
                <div className='flex items-center gap-2'>
                  <label className='text-sm'>Email: </label>
                  <input type="radio" name='email_or_phone' value={type} onChange={e => setType(e.target.value)} />
                </div>
                <div className='flex items-center gap-2'>
                  <label className='text-sm'>Phone: </label>
                  <input type="radio" name='email_or_phone' value={type} onChange={e => setType(e.target.value)} />
                </div>
              </div> */}
              <div className='flex flex-col gap-2 w-full'>
                <Textarea required placeholder='Reason for Getting in Touch' className='w-full h-9' id='reason' onChange={e => setReason(e.target.value)} />
              </div>
              <div className='flex flex-col gap-2 w-full'>
                <Textarea required placeholder='Message' className='w-full h-9' id='message' onChange={e => setContent(e.target.value)} />
              </div>
              <Button className='bg-darkblue px-8 py-6 text-white mt-4 rounded-full' onClick={handleSubmit}>
                SEND MESSAGE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}