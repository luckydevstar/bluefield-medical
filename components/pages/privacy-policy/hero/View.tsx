export interface PrivacyPolicyMetadata {
  title: string;
  subtitle: string;
}

interface PrivacyPolicyViewProps {
  data: PrivacyPolicyMetadata;
}

export function PrivacyPolicyHeroView({ data }: PrivacyPolicyViewProps) {
  return (
    <section className="relative min-h-[400px] bg-darkblue flex items-center justify-center overflow-hidden">
      <div className="mx-auto flex flex-col gap-6 max-w-7xl justify-between px-10 lg:px-14 pt-20 w-full text-white" aria-label="Global">
        <h1 className="text-2xl md:text-4xl font-bold leading-tight">
          {data.title}
        </h1>
        <p className="text-base md:text-md mb-8 opacity-90">
          {data.subtitle}
        </p>
      </div>
    </section>
  );
}