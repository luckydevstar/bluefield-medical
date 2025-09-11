import Link from 'next/link';
import { Twitter, Linkedin, Github } from 'lucide-react';

type StepImage = {
    key: string;
    url: string;
};

type StepItem = {
    title: string;
    description: string;
    image: StepImage;
};

export interface ProcessStepsData {
    title: string;
    steps: StepItem[];
}

interface HomeStepsViewProps {
    data: ProcessStepsData;
}

export function HomeStepsView({ data }: HomeStepsViewProps) {
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
                <h1 className="text-md md:text-xl text-center font-semibold mb-10">{data.title}</h1>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-6'>
                {
                    data.steps.map((item, idx) => {
                        return (
                            <div className='col-span-1 flex flex-col gap-5' key={idx}>
                                <div className='w-full h-72 flex justify-center'>
                                    <img src={item.image.url} className='w-full h-auto object-contain' alt={item.title} />
                                </div>
                                <h2 className="text-md font-semibold">{`0${idx+1} ${item.title}`}</h2>
                                <p className='text-slate-600 font-sm'>{item.description}</p>
                            </div>
                        )
                    })
                }
                </div>
            </div>
        </section>
    );
}