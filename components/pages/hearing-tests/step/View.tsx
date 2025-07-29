import { Button } from "@/components/ui/button";

interface StepData {
    title: string;
    subtitle: string;
    briefs: string[];
    steps: {
        title: string;
        description: string
    }[],
    cta: {
        label: string;
        link: string
    }
}

interface StepViewProps {
    data: StepData
}

export function HearingTestsStepView({ data }: StepViewProps) {
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-16 sm:py-20 lg:px-8">
                <div className="flex flex-col gap-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-darkblue">{data.title}</h1>
                    <div className="flex flex-col gap-2">
                        <p className="text-base lg:text-lg text-darkblue">{data.subtitle}</p>
                        <ul className="list-inside list-disc">
                            {
                                data.briefs.map((item, idx) => {
                                    return (
                                        <li key={idx}>{item}</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-darkblue">
                        {
                            data.steps.map((item, idx) => {
                                return (
                                    <div className="flex flex-col gap-1" key={idx}>
                                        <h2 className="text-base lg:text-lg font-semibold">{item.title}</h2>
                                        <p className="text-base lg:text-lg">{item.description}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <Button size="lg" className="w-max text-base px-16 py-8 rounded-full bg-lightblue hover:bg-lightblue text-white hover:text-white">
                        {data.cta.label}
                    </Button>
                </div>
            </div>
        </section>
    )
}