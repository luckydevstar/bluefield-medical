import { Button } from "@/components/ui/button";
import Link from "next/link";

type CTA = {
    label: string;
    link: string;
};

export interface HearingAidsDiscoverData {
    title: string;
    subtitle: string;
    cta: CTA;
}

interface HearingAidsDiscoverProps {
    data: HearingAidsDiscoverData
}

export function HearingAidsDiscoverView({ data }: HearingAidsDiscoverProps) {
    return (
        <section className="bg-lightblue">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
                <div className="flex w-full flex-col gap-6 items-center">
                    <h1 className="text-3xl font-block text-darkblue text-center">{data.title}</h1>
                    <p className="text-lg text-darkblue text-center">{data.subtitle}</p>
                    <Link href={data.cta.link}>
                        <Button size="lg" className="text-base px-8 py-4 rounded-full bg-darkblue hover:bg-white text-white hover:text-darkblue">
                            {data.cta.label}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}