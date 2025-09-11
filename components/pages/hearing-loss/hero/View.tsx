import Image from 'next/image';
import { Button } from '@/components/ui/button';

export interface HeroData {
  title: string;
  subtitle: string;
  image: {
    key: string;
    url: string;
  };
  ctaText: string;
  ctaLink: string;
}

interface HeroViewProps {
  data: HeroData;
}

export function HearingLossHeroView({ data }: HeroViewProps) {
  return (
    <section className="relative min-h-[600px] flex items-end justify-center overflow-hidden">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
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

        <div className="relative z-10 text-left text-white px-6 w-full">
          <h1 className="text-2xl md:text-4xl font-bold mb-16 shadow-lg md:mx-12 leading-tight text-left">
            {data.title}
          </h1>
        </div>
      </div>
    </section>
  );
}