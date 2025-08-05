export interface PrivacyPolicyMetadata {
  title: string;
  subtitle: string;
}

interface PrivacyPolicyViewProps {
  data: PrivacyPolicyMetadata;
}

export function PrivacyPolicyHeroView({ data }: PrivacyPolicyViewProps) {
  return (
    <section className="relative min-h-[660px] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          {data.title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
          {data.subtitle}
        </p>
      </div>
    </section>
  );
}