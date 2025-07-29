import Image from 'next/image';

export interface HeroData {
  title: string;
  image: {
    key: string;
    url: string;
  };
}

interface HeroViewProps {
  data: HeroData;
}

export function FaqsHeroView({ data }: HeroViewProps) {
  return (
    <section className="relative min-h-[660px] flex items-end justify-center overflow-hidden">
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
      </div>
    </section>
  );
}