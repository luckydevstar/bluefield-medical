
type ServiceImage = {
    key: string;
    url: string;
};

type TeamMember = {
    name: string;
    role: string;
    photo: ServiceImage;
    title: string;
    description: string;
};

type Team = {
    leaders: TeamMember[];
    members: TeamMember[];
};

type Intro = {
    photo: ServiceImage;
    title: string;
    paragraphs: string[];
};

type WhatWeDo = {
    image: ServiceImage;
    title: string;
    content: string[];
};

type Summary = {
    title: string;
    content: string[];
};

type KnowData = {
    title: string;
    subtitle: string;
    trusts: TrustItem[];
};

type TrustItem = {
    title: string;
    description: string;
};

export interface AboutData {
    perk: {
        image: ServiceImage;
        title: string;
        content: string[];
    };
    team: Team;
    about: {
        title: string;
        content: string[];
        subtitle: string;
    };
    intro: Intro;
    summary: Summary;
    what_we_do: WhatWeDo;
}

interface AboutUsPageProps {
    data: AboutData;
}

export function AboutUsAboutView({ data }: AboutUsPageProps) {
    return (
        <>
            <section className="relative min-h-[660px] flex items-center justify-center overflow-hidden bg-white">
                <div className="mx-auto flex flex-col items-start max-w-7xl justify-between px-6 pt-12 sm:pt-16 lg:px-8 gap-8 text-darkblue" aria-label="Global">
                    <div className="flex flex-col gap-8">
                        <h1 className="text-2xl lg:text-3xl font-medium">{data.intro.title}</h1>
                        {
                            data.intro.paragraphs.map((item, idx) => {
                                return (
                                    <p className="text-base" key={idx}>{item}</p>
                                )
                            })
                        }
                        <img src={data.intro.photo.url} alt={data.intro.photo.key} className="w-full h-auto" />
                    </div>
                    <div className="flex flex-col gap-6 mt-4">
                        <h1 className="text-2xl lg:text-3xl font-medium">{data.about.title}</h1>
                        <h2 className="text-lg lg:text-xl font-medium">{data.about.subtitle}</h2>
                        {
                            data.about.content.map((item, idx) => {
                                return (
                                    <p className="text-base" key={idx}>{item}</p>
                                )
                            })
                        }
                    </div>
                    <div className='flex flex-col lg:flex-row items-center gap-16 py-10'>
                        <div className={`w-full lg:w-1/2 flex justify-center`}>
                            <img src={data.what_we_do.image.url} className='object-contain h-auto' />
                        </div>
                        <div className={`flex flex-col gap-6 flex-1 lg:justify-center items-center`}>
                            <h2 className='text-2xl w-full lg:text-left text-center lg:text-3xl font-black text-darkblue'>{data.what_we_do.title}</h2>
                            {
                                data.what_we_do.content.map((item, idx) => {
                                    return (
                                        <p key={idx} className='text-base text-darkblue text-left'>{item}</p>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </section>
            <section className="relative flex items-center justify-center overflow-hidden bg-darkblue">
                <div className="mx-auto flex flex-col items-start max-w-7xl justify-between px-6 lg:px-8 gap-8 text-white" aria-label="Global">
                    <div className='flex flex-col lg:flex-row items-center gap-16 py-10'>
                        <div className={`w-full lg:w-1/2 flex justify-center`}>
                            <img src={data.perk.image.url} className='object-contain h-auto' />
                        </div>
                        <div className={`flex flex-col gap-6 flex-1 lg:justify-center items-center`}>
                            <h2 className='text-2xl w-full lg:text-left text-center lg:text-3xl font-black text-white'>{data.perk.title}</h2>
                            {
                                data.perk.content.map((item, idx) => {
                                    return (
                                        <p key={idx} className='text-base text-white text-left'>{item}</p>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </section>
            <section className="relative flex items-center justify-center overflow-hidden bg-white">
                <div className="mx-auto max-w-7xl justify-between px-6 lg:px-8 gap-8 py-20 text-darkblue" aria-label="Global">
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {
                            data.team.members.map((item, idx) => {
                                return (
                                    <div className="flex flex-col gap-6" key={idx}>
                                        <div className="w-full flex justify-center">
                                            <img src={item.photo.url} className="max-w-[400px] w-full object-contain rounded-full" />
                                        </div>
                                        <div className="flex flex-col gap-3 text-center">
                                            <h4 className="font-semibold">{`${item.name}, ${item.role}`}</h4>
                                            <p className="font-medium">{item.title}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </section>
            {
                data.team.leaders.map((item, idx) => {
                    return (
                        <section key={idx} className={`relative flex items-center justify-center overflow-hidden`} style={{ backgroundColor: idx % 2 ? 'white' : '#E8EEEA' }}>
                            <div className="mx-auto flex flex-col items-start max-w-7xl justify-between px-6 lg:px-8 gap-8 text-darkblue" aria-label="Global">
                                <div className={`flex flex-col lg:flex-row items-center gap-16 py-10 ${idx % 2 ? 'leaf-right' : 'leaf-left'}`}>
                                    <div className={`w-full lg:w-1/2 flex justify-center leaf-item-1`}>
                                        <img src={item.photo.url} className='object-contain h-auto' />
                                    </div>
                                    <div className={`flex flex-col gap-6 flex-1 lg:justify-center items-center leaf-item-2`}>
                                        <h4 className="text-lg text-left w-full font-bold">{`${item.name} | ${item.role}`}</h4>
                                        <h2 className='text-2xl w-full lg:text-left text-center lg:text-3xl font-black text-darkblue'>{item.title}</h2>
                                        <p key={idx} className='text-base text-darkblue text-left'>{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                })
            }
            <section className="relative flex items-center justify-center overflow-hidden bg-white">
                <div className="mx-auto flex flex-col items-start max-w-7xl justify-between py-12 lg:py-20 px-6 lg:px-8 gap-8 text-darkblue" aria-label="Global">
                    <h1 className="text-2xl lg:text-3xl font-semibold">{data.summary.title}</h1>
                    <p className="text-base">{data.summary.content}</p>
                </div>
            </section>
        </>
    )
}