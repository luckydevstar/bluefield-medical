'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  CalendarClock,
  ClipboardList,
  Menu,
  LogOut,
  KeyRound,
} from 'lucide-react';

import { cn } from '@/lib/utils'; // shadcn’s utility; adjust if you keep it elsewhere
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type NavItem = {
  href: string;
  label: string;
  icon: any;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/locations', label: 'Locations', icon: MapPin },
  { href: '/admin/service-days', label: 'Service Days', icon: CalendarClock },
  { href: '/admin/bookings', label: 'Bookings', icon: ClipboardList },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href || (href !== '/admin' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminShell({
  children,
  username,
}: {
  children: React.ReactNode;
  /** Optional: pass the admin username from your server layout if you have it */
  username?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const logout = async () => {
    // Your logout route (DELETE) lives at /admin/login per earlier setup
    await fetch('/admin/login', { method: 'DELETE' });
    router.replace('/admin/login');
  };

  const gotoChangePassword = () => router.push('/admin/change-password');

  const initials = (username ?? 'Admin')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="grid min-h-screen md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="hidden border-r bg-muted/30 md:block">
        <div className="p-4">
          <Link href="/admin" className="block">
            <span className="text-base font-semibold">Bluefield Admin</span>
          </Link>
        </div>
        <Separator />
        <ScrollArea className="h-[calc(100vh-48px)] p-3">
          <SidebarNav />
        </ScrollArea>
      </aside>

      {/* Content column */}
      <div className="flex min-w-0 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="flex h-14 items-center gap-3 px-3 md:px-4">
            {/* Mobile: open sidebar */}
            <div className="md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <SheetHeader className="px-4 py-3 text-left">
                    <SheetTitle>Bluefield Admin</SheetTitle>
                  </SheetHeader>
                  <Separator />
                  <div className="p-3">
                    <SidebarNav onNavigate={() => setOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Title (desktop topbar) */}
            <div className="md:hidden">
              <Link href="/admin" className="text-sm font-semibold">
                Bluefield Admin
              </Link>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium sm:inline">
                      {username ?? 'Admin'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="truncate">
                    {username ?? 'Admin'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={gotoChangePassword} className="cursor-pointer">
                    <KeyRound className="mr-2 h-4 w-4" />
                    Change password
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
