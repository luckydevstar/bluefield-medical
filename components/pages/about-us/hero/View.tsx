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

export function AboutUsHeroView({ data }: HeroViewProps) {
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
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
          {data.subtitle}
        </p>
        <Button size="lg" className="text-lg px-12 py-6 rounded-full bg-lightblue hover:bg-lightblue text-darkblue hover:text-white">
          {data.ctaText}
        </Button>
      </div>
    </section>
  );
}