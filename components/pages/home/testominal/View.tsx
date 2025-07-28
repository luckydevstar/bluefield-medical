import Link from 'next/link';
import { Twitter, Linkedin, Github } from 'lucide-react';

type TestimonialItem = {
    content: string;
    name: string;
    location: string;
    source: string;
    avatar: {
        key: string,
        url: string
    }
};

export interface TestimonialsData {
    title: string;
    testominals: TestimonialItem[];
}

interface HomeTestominalViewProps {
    data: TestimonialsData
}


export function HomeTestominalView({ data }: HomeTestominalViewProps) {
    return (
        <section className="bg-darkblue">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
                <h1 className="text-2xl md:text-3xl text-center font-semibold mb-10 text-white">{data.title}</h1>
                <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-6'>
                    {
                        data.testominals.map((item, idx) => {
                            return (
                                <div className='col-span-1 flex flex-col gap-5 bg-white rounded-2xl p-8 justify-between' key={idx}>
                                    <p className='text-base text-slate-600'>{item.content}</p>
                                    <div className='flex items-center gap-4'>
                                        <img src={item.avatar.url} className='w-16 h-16 rounded-full' />
                                        <div className='flex flex-col'>
                                            <span className='text-lg'>{item.name}</span>
                                            <span className='font-medium text-sm text-slate-600'>
                                                {
                                                    `${item.location} - ${item.source}`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    );
}