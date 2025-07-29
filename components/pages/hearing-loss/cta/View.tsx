import { Button } from "@/components/ui/button"

interface HearingLossCTAData {
    label: "string",
    link: "string"
}

interface HearingLossCTAProps {
    data: HearingLossCTAData
}

export function HearingLossCTAView({ data }: HearingLossCTAProps) {
    return (
        <section className="bg-darkblue">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-8 sm:py-12 lg:px-8">
                <div className="w-full flex items-center justify-center">
                    <Button size="lg" className="w-max text-base px-16 py-8 rounded-full bg-lightblue hover:bg-lightblue text-white hover:text-white">
                        {data.label}
                    </Button>
                </div>
            </div>
        </section>
    )
}