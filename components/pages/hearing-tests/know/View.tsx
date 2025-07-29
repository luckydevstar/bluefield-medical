interface KnowData {
    title: string;
    description: string;
}

interface KnowViewProps {
    data: KnowData
}

export function HearingTestsKnowView({ data }: KnowViewProps) {
    return (
        <section className="bg-darkblue">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-8 sm:py-12 lg:px-8">
                <div className="flex flex-col gap-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">{data.title}</h1>
                    <p className="text-base lg:text-lg text-white">{data.description}</p>
                </div>
            </div>
        </section>
    )
}
