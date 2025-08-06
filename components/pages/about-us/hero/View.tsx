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

export function AboutUsHeroView({ data }: HeroViewProps) {
  return (
    <section className="relative min-h-[440px] flex items-center justify-center overflow-hidden">
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

      <div className="mx-auto flex flex-col gap-6 max-w-7xl justify-between px-10 lg:px-14 mt-48 w-full text-white" aria-label="Global">
        <h1 className="text-2xl md:text-4xl font-bold leading-tight z-10">
          {data.title}
        </h1>
      </div>
    </section>
  );
}