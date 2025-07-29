import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";

type FAQItem = {
    title: string;
    description: string;
};

type FAQSection = {
    title: string;
    list: FAQItem[];
}

export interface FAQData {
    title: string;
    faqs: FAQSection[]
}

interface FaqsFAQViewProps {
    data: FAQData
}

export function FaqsFAQView({ data }: FaqsFAQViewProps) {
    return (
        <section className="bg-[#E8EEEA]">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
                <h1 className="text-2xl lg:text-3xl font-black text-darkblue mb-6">{data.title}</h1>
                <div className="flex flex-col gap-8">
                    {
                        data.faqs.map((item, idx) => {
                            return (
                                <div key={idx}>
                                    <h1 className="text-xl lg:text-2xl font-black text-darkblue">{item.title}</h1>
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="w-full"
                                        defaultValue="item-1"
                                    >
                                        {
                                            item.list.map((faq, idx) => {
                                                return (
                                                    <AccordionItem value={`item-${idx}`} key={idx}>
                                                        <AccordionTrigger className="text-darkblue hover:no-underline hover:text-lightblue text-lg font-bold">{faq.title}</AccordionTrigger>
                                                        <AccordionContent className="flex flex-col gap-4 text-balance">
                                                            <p>
                                                                {faq.description}
                                                            </p>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                )
                                            })
                                        }
                                    </Accordion>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    );
}