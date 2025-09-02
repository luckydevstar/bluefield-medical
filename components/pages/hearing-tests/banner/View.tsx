import { Button } from "@/components/ui/button";
import Link from "next/link";

type CTA = {
    label: string;
    link: string;
};

export interface HearingAidsBannerData {
    title: string;
    description: string;
    cta: CTA;
}

interface HearingAidsBannerProps {
    data: HearingAidsBannerData
}

export function HearingAidsBannerView({ data }: HearingAidsBannerProps) {
    return (
        <section className="bg-lightblue">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
                <div className="flex w-full flex-col gap-6">
                    <h1 className="text-3xl font-bold text-darkblue">{data.title}</h1>
                    <p className="text-lg text-darkblue">{data.description}</p>
                    <Link href={data.cta.link}>
                        <Button size="lg" className="w-max text-base px-8 py-4 rounded-full bg-darkblue hover:bg-white text-white hover:text-darkblue">
                            {data.cta.label}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}