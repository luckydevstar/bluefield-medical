import Link from 'next/link';
import { Twitter, Linkedin, Github } from 'lucide-react';

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
    services: ServiceItem[];
}

interface HomeServiceViewProps {
    data: ServicesData
}


export function HomeServiceView({ data }: HomeServiceViewProps) {
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-8 sm:py-6 lg:px-8">
                <div className='w-full gap-x-4 gap-y-12 flex flex-col'>
                    {
                        data.services.map((item, idx) => {
                            return (
                                <div 
                                    key={idx} 
                                    className='flex flex-col lg:flex-row items-center gap-16'
                                >
                                    <div 
                                        className={`w-[475px] lg:order-${idx % 2 ? 2 : 1}`} 
                                        key={idx}
                                    >
                                        <img src={item.image.url} className='object-contain h-auto' />
                                    </div>
                                    <div className='flex flex-col gap-6 flex-1 lg:justify-center items-center'>
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