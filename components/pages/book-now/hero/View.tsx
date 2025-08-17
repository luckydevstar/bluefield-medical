import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { isEmail } from '@/src/utils/email';

export interface HeroData {
  title: string;
  subtitle: string;
  destination_email: string;
}

interface HeroViewProps {
  data: HeroData;
}

export function BookNowHeroView({ data }: HeroViewProps) {
  const [location, setLocation] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const toEmail = data.destination_email ?? 'info@bluefields.uk';

  const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const handleSubmit = async () => {
    if (!email || !name || !phone || !location) {
      toast.info("You inputs are invalid.")

      return;
    }

    if (!isEmail(email)) {
      toast.info("Email type is invalid.");

      return;
    }


    const emailContent = `<!doctype html><html><body style="margin:0;background:#f6f9fc;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f6f9fc;padding:24px 0;">
        <tr>
          <td align="center" style="padding:0 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:600px;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
              <tr>
                <td style="background:#111827;color:#ffffff;padding:18px 24px;font-weight:700;font-size:18px;">
                  New booking request
                </td>
              </tr>
              <tr>
                <td style="padding:24px;color:#111827;">
                  <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">You’ve received a new booking request.</p>

                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #e5e7eb;border-radius:12px;">
                    <tr>
                      <td style="width:110px;color:#6b7280;font-size:13px;padding:10px 12px;border-bottom:1px solid #f3f4f6;">Name</td>
                      <td style="font-size:14px;padding:10px 12px;border-bottom:1px solid #f3f4f6;">${esc(name)}</td>
                    </tr>
                    <tr>
                      <td style="width:110px;color:#6b7280;font-size:13px;padding:10px 12px;border-bottom:1px solid #f3f4f6;">Email</td>
                      <td style="font-size:14px;padding:10px 12px;border-bottom:1px solid #f3f4f6;">
                        <a href="mailto:${esc(email)}" style="color:#111827;text-decoration:underline;">${esc(email)}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="width:110px;color:#6b7280;font-size:13px;padding:10px 12px;border-bottom:1px solid #f3f4f6;">Phone</td>
                      <td style="font-size:14px;padding:10px 12px;border-bottom:1px solid #f3f4f6;">
                        <a href="tel:${esc(phone)}" style="color:#111827;text-decoration:underline;">${esc(phone)}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="width:110px;color:#6b7280;font-size:13px;padding:10px 12px;">Location</td>
                      <td style="font-size:14px;padding:10px 12px;">${esc(location)}</td>
                    </tr>
                  </table>

                  <p style="color:#6b7280;font-size:12px;margin-top:18px;">Sent via Bluefields "Book Now" form.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body></html>`;

    const subject = `Book request from ${name} `;

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
      setLocation("");
      setPhone("");
    }



    console.log(await res.json())
  }

  return (
    <section className="relative min-h-[660px] overflow-hidden">
      <div className="mx-auto flex flex-col items-start max-w-7xl justify-between px-12 lg:px-16" aria-label="Global">
        <div className='flex flex-col gap-10 py-20'>
          <h1 className='text-darkblue font-semibold text-2xl lg:text-4xl'>{data.title}</h1>
          <p className='text-darkblue text-lg'>{data.subtitle}</p>
        </div>
        <div className='mb-20  flex flex-col gap-6 max-w-lg w-full'>
          <div className='flex flex-col gap-4 w-full'>
            <label className='text-darkblue font-semibold text-base' htmlFor='name'>Name *</label>
            <Input required className='w-full' id='name' value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className='flex flex-col gap-4 w-full'>
            <label className='text-darkblue font-semibold text-base' htmlFor='email'>Email *</label>
            <Input required className='w-full' id='email' onChange={e => setEmail(e.target.value)} />
          </div>
          <div className='flex flex-col gap-4 w-full'>
            <label className='text-darkblue font-semibold text-base' htmlFor='phone'>Phone *</label>
            <Input required className='w-full' id='phone' onChange={e => setPhone(e.target.value)} />
          </div>
          <div className='flex flex-col gap-4 w-full'>
            <label className='text-darkblue font-semibold text-base' htmlFor='location'>Location *</label>
            <Input required className='w-full' id='location' onChange={e => setLocation(e.target.value)} />
          </div>
          <Button className='bg-darkblue px-8 py-4 text-white mt-4' onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </section>
  );
}