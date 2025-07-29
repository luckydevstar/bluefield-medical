import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

type TrustItem = {
    title: string;
    description: string;
};

export interface HearingLossTrustData {
    title: string;
    subtitle: string;
    trusts: TrustItem[];
}

interface HearingLossTrustViewProps {
    data: HearingLossTrustData
}

export function HearingLossTrustView({ data }: HearingLossTrustViewProps) {
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-8 sm:py-6 lg:px-8">
                <h1 className="text-3xl font-bold text-darkblue text-center">{data.title}</h1>
                <p className="text-lg text-darkblue my-8">{data.subtitle}</p>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue="item-1"
                >
                    {
                        data.trusts.map((item, idx) => {
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
            </div>
        </div>
    )
}
