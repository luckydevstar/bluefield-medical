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

  const handleSubmit = async () => {
    if (!email || !name || !phone || !location) {
      toast.info("You inputs are invalid.")

      return;
    }

    if (!isEmail(email)) {
      toast.info("Email type is invalid.");

      return;
    }

    const emailContent = `
      <p>Contact Info: ${name}, ${email}, ${phone}</p>
        <p>Location: ${location}</p>
      `
    const subject = `Book request from ${name}`;

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

    

    console.log(res.json())
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
            <Input required className='w-full' id='email' onChange={e => setEmail(e.target.value)}  />
          </div>
          <div className='flex flex-col gap-4 w-full'>
            <label className='text-darkblue font-semibold text-base' htmlFor='phone'>Phone *</label>
            <Input required className='w-full' id='phone'  onChange={e => setPhone(e.target.value)} />
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