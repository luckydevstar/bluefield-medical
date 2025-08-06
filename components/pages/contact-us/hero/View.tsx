import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
                <Input required placeholder='Name *' size={32} className='w-full h-9' id='name' />
              </div>
              <div className='flex flex-col gap-2 w-full'>
                <Input required placeholder='Email *' size={32} className='w-full h-9' id='email' />
              </div>
              <div className='flex flex-col gap-2 w-full'>
                <Input required placeholder='Phone *' size={32} className='w-full h-9' id='phone' />
              </div>
              <div className='flex gap-6 px-4'>
                <div className='flex items-center gap-2'>
                  <label className='text-sm'>Email: </label>
                  <input type="radio" name='email_or_phone' />
                </div>
                <div className='flex items-center gap-2'>
                  <label className='text-sm'>Phone: </label>
                  <input type="radio" name='email_or_phone' />
                </div>
              </div>
              <div className='flex flex-col gap-2 w-full'>
                <Input required placeholder='Reason for Getting in Touch *' size={32} className='w-full h-9' id='reason' />
              </div>
              <div className='flex flex-col gap-2 w-full'>
                <Input required placeholder='Message *' size={32} className='w-full h-9' id='message' />
              </div>
              <Button className='bg-darkblue px-8 py-6 text-white mt-4 rounded-full'>
                SEND MESSAGE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}