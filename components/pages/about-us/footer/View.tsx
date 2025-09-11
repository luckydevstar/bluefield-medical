import Link from 'next/link';
import { Twitter, Linkedin, Github } from 'lucide-react';

export const Icons = {
    "LinkedIn": Linkedin,
    "Twitter": Twitter,
    "GitHub": Github
}

type SocialName = 'LinkedIn' | 'Twitter' | 'GitHub';

type SocialITem = {
    name: SocialName;
    url: string;
}

type LinkItem = {
    name: string;
    url: string;
}

type QuestionItem = {
    name: string;
    phone: string
}

export interface FooterData {
    logo: {
        key: string;
        url: string;
    };
    social: SocialITem[],
    address: string;
    resources: LinkItem[],
    company: LinkItem[],
    questions: QuestionItem[]
};

interface FooterViewProps {
    data: FooterData;
}

export function AboutUsFooterView({ data }: FooterViewProps) {
    return (
        <footer className="bg-white">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 pb-20 sm:py-24 lg:px-8">
                <div className='w-full grid grid-cols-3 gap-x-4 gap-y-12'>
                    <div className='col-span-3 md:col-span-1 lg:col-span-1 flex flex-col gap-6'>
                        <Link href="/" className="-m-1.5 p-1.5">
                            <img src={data.logo.url} alt='logo' className='w-[150px] lg:w-[190px]' />
                        </Link>
                        <div className='flex gap-4'>
                            {
                                data.social.map((item, idx) => {
                                    let SocialIcon = Icons[item.name]
                                    return (
                                        <Link href={item.url} className='bg-darkblue hover:bg-darkblue transition-colors rounded-full px-2 py-2 flex items-center justify-center' key={idx}>
                                            {SocialIcon && <SocialIcon className="w-4 h-4" />}
                                        </Link>
                                    )
                                })
                            }
                        </div>
                        <p className='text-lightblue text-sm'>
                            {data.address}
                        </p>
                    </div>
                    <div className='flex flex-col gap-4 col-span-3 md:col-span-1 lg:col-span-1'>
                        <h2 className='text-lg font-black text-darkblue'>RESOURCES</h2>
                        <div className='flex flex-col gap-3'>
                            {
                                data.resources.map((item, idx) => {
                                    return (
                                        <Link href={item.url} key={idx} className='flex flex-col gap-1 text-md text-darkblue'>
                                            <span className='font-medium'>{item.name}</span>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 col-span-3 md:col-span-1 lg:col-span-1'>
                        <h2 className='text-lg font-black text-darkblue'>COMPANY</h2>
                        <div className='flex flex-col gap-3'>
                            {
                                data.company.map((item, idx) => {
                                    return (
                                        <Link href={item.url} className='flex flex-col gap-1 text-md text-darkblue' key={idx}>
                                            <span className='font-medium'>{item.name}</span>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}