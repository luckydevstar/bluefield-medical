import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface HeroData {
  title: string;
  subtitle: string;
  destination_email: string;
}

interface HeroViewProps {
  data: HeroData;
}

export function BookNowHeroView({ data }: HeroViewProps) {
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
            <Input required className='w-full' id='name' />
          </div>
          <div className='flex flex-col gap-4 w-full'>
            <label className='text-darkblue font-semibold text-base' htmlFor='email'>Email *</label>
            <Input required className='w-full' id='email' />
          </div>
          <div className='flex flex-col gap-4 w-full'>
            <label className='text-darkblue font-semibold text-base' htmlFor='phone'>Phone *</label>
            <Input required className='w-full' id='phone' />
          </div>
          <div className='flex flex-col gap-4 w-full'>
            <label className='text-darkblue font-semibold text-base' htmlFor='location'>Location *</label>
            <Input required className='w-full' id='location' />
          </div>
          <Button className='bg-darkblue px-8 py-4 text-white mt-4'>
            Submit
          </Button>
        </div>
      </div>
    </section>
  );
}