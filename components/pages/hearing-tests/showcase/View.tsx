import { Button } from "@/components/ui/button";
import Link from "next/link";

type Image = {
    key: string;
    url: string;
};

type CTA = {
    label: string;
    link: string;
};

type ShowcaseItem = {
    image: Image;
    title: string;
    description: string;
};

export interface HearingAidsShowcaseData {
    title: string;
    titleDescription: string;
    subtitle: string;
    subtitleDescription: string;
    cta: CTA;
    showcases: ShowcaseItem[];
}

interface HearingAidsShowcaseProps {
    data: HearingAidsShowcaseData
}

export function HearingAidsShowcaseView({ data }: HearingAidsShowcaseProps) {
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
                <div className="flex flex-col gap-5">
                    <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-darkblue">{data.title}</h1>
                    <p className="text-sm text-darkblue md:text-base">{data.titleDescription}</p>
                </div>
                <div className="flex flex-col gap-5 mt-12">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-black text-lightblue">{data.subtitle}</h2>
                    <div className="text-sm text-darkblue md:text-base">{data.subtitleDescription}</div>
                    <Link href={data.cta.link}>
                        <Button size="lg" className="mt-8 mb-12 w-max text-base px-8 py-4 rounded-full bg-darkblue hover:bg-lightblue text-white hover:text-darkblue">
                            {data.cta.label}
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {
                        data.showcases.map((item, idx) => {
                            return (
                                <div className="w-full flex flex-col px-5 pt-5 py-8 rounded-2xl gap-6 hover:shadow-xl border" key={idx}>
                                    <div className="w-full">
                                        <img src={item.image.url} alt={item.title} className="object-cover" />
                                    </div>
                                    <div className="w-full flex flex-col gap-4">
                                        <h3 className="text-lg md:text-2xl font-bold text-darkblue">{item.title}</h3>
                                        <p className="text-sm md:text-base text-slate-600">{item.description}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}