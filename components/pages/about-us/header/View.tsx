import { Button } from '@/components/ui/button';
import { Menu, X} from 'lucide-react';
import { useState } from 'react';
import cn from "classnames"
import Link from 'next/link';

export type NavLink = {
    name: string,
    url: string
}

export interface HeaderData {
    logo: {
        key: string;
        url: string;
    };
    nav_links: NavLink[];
    cta: {
        label: string;
        url: string;
    }
}

interface HeaderViewProps {
    data: HeaderData
}

export function AboutUsHeaderView({ data }: HeaderViewProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-white backdrop-blur supports-[backdrop-filter]:bg-white">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-2 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 p-1.5">
                            <img src={data.logo.url} alt='logo' className='w-[120px] lg:w-[160px]' />
                        </Link>
                    </div>
                    <div className='flex items-center gap-4 lg:gap-12 '>
                        <div className="flex lg:hidden">
                            <button
                                type="button"
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <span className="sr-only">Open main menu</span>
                                <Menu className="h-6 w-6 text-darkblue" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="hidden lg:flex lg:gap-x-8">
                            {data.nav_links.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.url}
                                    className={cn(
                                        "text-sm font-semibold leading-6 transition-colors hover:text-lightblue text-darkblue",
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        <Button className='bg-lightblue hover:bg-lightblue rounded-full px-4 py-2 md:px-8 md:py-4' asChild>
                            <Link href="/book-now" className='text-black hover:text-white text-xs md:text-lg'>BOOK ONLINE</Link>
                        </Button>
                    </div>
                </nav>

            </header>
            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden">
                    <div className="fixed inset-0 z-50" />
                    <div className="fixed inset-y-0 right-0 z-50 w-full bg-darkblue overflow-y-auto bg-background px-6 py-4 sm:max-w-sm sm:ring-1 sm:ring-border">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="-m-1.5 p-1.5">
                                <img src={'/logo_white.png'} alt='logo' className='w-[150px] lg:w-[190px]' />
                            </Link>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <X className="h-6 w-6 text-white" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-border">
                                <div className="space-y-2 py-6">
                                    {data.nav_links.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.url}
                                            className={cn(
                                                "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors hover:bg-white/10 text-white"
                                            )}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}