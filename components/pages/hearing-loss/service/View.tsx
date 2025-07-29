type ServiceImage = {
    key: string;
    url: string;
};

type ServiceItem = {
    title: string;
    description: string;
    image: ServiceImage;
};

export interface ServicesData {
    title: string,
    subtitle: string;
    services: ServiceItem[];
}

interface HearingLossServiceViewProps {
    data: ServicesData
}


export function HearingLossServiceView({ data }: HearingLossServiceViewProps) {
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-8 sm:py-6 lg:px-8">
                <h1 className="text-3xl font-bold text-darkblue text-center">{data.title}</h1>
                <p className="text-lg text-darkblue my-8">{data.subtitle}</p>
                <div className='w-full gap-x-4 gap-y-12 flex flex-col'>
                    {
                        data.services.map((item, idx) => {
                            return (
                                <div
                                    key={idx}
                                    className='flex flex-col lg:flex-row items-center gap-16'
                                >
                                    <div
                                        className={`w-[475px] ${idx % 2 ? 'lg:order-2' : 'lg:order-1'}`}
                                        key={idx}
                                    >
                                        <img src={item.image.url} className='object-contain h-auto' />
                                    </div>
                                    <div className={`flex flex-col gap-6 flex-1 lg:justify-center items-center  ${idx % 2 ? 'lg:order-1' : 'lg:order-2'}`}>
                                        <h2 className='text-2xl w-full lg:text-left text-center lg:text-3xl font-black text-darkblue'>{item.title}</h2>
                                        <p className='text-base lg:text-lg text-darkblue text-center lg:text-left'>{item.description}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}