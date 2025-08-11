import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import Link from "next/link";

type FAQItem = {
    title: string;
    description: string;
};

type FAQCallToAction = {
    label: string;
    link: string;
};

export interface FAQData {
    title: string;
    faqs: FAQItem[];
    cta: FAQCallToAction;
}

interface HearingAidsFAQViewProps {
    data: FAQData
}

export function HearingAidsFAQView({ data }: HearingAidsFAQViewProps) {
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
                <h1 className="text-3xl font-black text-darkblue">{data.title}</h1>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue="item-1"
                >
                    {
                        data.faqs.map((item, idx) => {
                            return (
                                <AccordionItem value={`item-${idx}`} key={idx}>
                                    <AccordionTrigger className="text-darkblue hover:no-underline hover:text-lightblue text-lg font-bold">{item.title}</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-4 text-balance">
                                        <p>
                                            {item.description}
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })
                    }
                </Accordion>
                <Link href={data.cta.link}>
                    <Button size="lg" className="mt-8 text-base px-8 py-4 rounded-full bg-lightblue hover:bg-lightblue text-darkblue hover:text-white">
                        {data.cta.label}
                    </Button>
                </Link>
            </div>
        </section>
    );
}