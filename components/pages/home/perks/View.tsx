import Link from 'next/link';

type PerkIcon = {
    key: string;
    url: string;
};

type PerkItem = {
    title: string;
    icon: PerkIcon;
};

export interface PerksData {
    perks: PerkItem[];
}

interface HomePerksProps {
    data: PerksData;
}

export function HomePerksView({ data }: HomePerksProps) {
    return (
        <section className="bg-darkblue">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-6 sm:py-8 lg:px-8">
                <div className='w-full flex justify-around gap-y-6 mb-6'>
                    {
                        data.perks.map((item, idx) => {
                            return (
                                <div className='flex flex-col gap-4 justify-center items-center' style={{width: `${100 / (data.perks ?? []).length}%`}} key={idx}>
                                    <div className='w-32 flex justify-center'>
                                        <img className='w-full h-auto' src={item.icon.url} alt={item.title} />
                                    </div>
                                    <h2 className="text-lg font-medium text-white">{`${item.title}`}</h2>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    );
}