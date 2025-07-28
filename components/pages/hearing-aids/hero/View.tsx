import Image from 'next/image';
import { Button } from '@/components/ui/button';

export interface HearingAidsHeroData {
  title: string;
  image: {
    key: string,
    url: string
  };
}

interface HearingAidsHeroViewProps {
  data: HearingAidsHeroData;
}

export function HearingAidsHeroView({ data }: HearingAidsHeroViewProps) {
  return (
    <section className="relative min-h-[660px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={data.image.url}
          alt={data.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          {data.title}
        </h1>
      </div>
    </section>
  );
}