export interface HearingLossTestimonialData {
    title: string;
    content: string;
    name: string;
    location: string;
}

interface HearingLossTestominalProps {
    data: HearingLossTestimonialData
}


export function HearingLossTestominalView({ data }: HearingLossTestominalProps) {
    return (
        <section className="bg-darkblue">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-lightblue text-center">{data.title}</h2>
                <p className="text-base md:text-lg italic lg:text-xl font-bold text-white text-center my-16">{data.content}</p>
                <div className="flex flex-col items-center justify-center">
                    <h4 className="text-lg font-black text-lightblue">{data.name}</h4>
                    <h4 className="text-base font-bold text-lightblue">{data.location}</h4>
                </div>
            </div>
        </section>
    )
}