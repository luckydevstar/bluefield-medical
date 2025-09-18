'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';

type Consent = {
    necessary: true;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
    version: number;
    timestamp: string;
};

const CONSENT_COOKIE = 'bf_cookie_consent';
const CONSENT_VERSION = 1;               // bump to re-prompt users after changes
const SIX_MONTHS = 60 * 60 * 24 * 30 * 6;

function readConsent(): Consent | null {
    if (typeof document === 'undefined') return null;
    const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]+)`));
    if (!m) return null;
    try { return JSON.parse(decodeURIComponent(m[1])); } catch { return null; }
}
function writeConsent(c: Consent) {
    const v = encodeURIComponent(JSON.stringify(c));
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${CONSENT_COOKIE}=${v}; Max-Age=${SIX_MONTHS}; Path=/; SameSite=Lax${secure}`;
}

export default function CookieConsentDrawer() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const c = readConsent();
        // open if no consent yet or version changed
        if (!c || c.version !== CONSENT_VERSION) setOpen(true);
    }, []);

    // prevent closing the drawer unless consent already stored
    const onOpenChange = (next: boolean) => {
        if (!next) {
            const c = readConsent();
            if (!c || c.version !== CONSENT_VERSION) return; // block close
        }
        setOpen(next);
    };

    const acceptAll = () => {
        writeConsent({
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true,
            version: CONSENT_VERSION,
            timestamp: new Date().toISOString(),
        });
        setOpen(false);
        location.reload();
    };

    const rejectAll = () => {
        writeConsent({
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false,
            version: CONSENT_VERSION,
            timestamp: new Date().toISOString(),
        });
        setOpen(false);
        location.reload();
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {/* DrawerContent already renders a full-width bar at the bottom and a dark overlay */}
            <DrawerContent className="w-full px-0">
                <div className="mx-auto w-full max-w-7xl px-4">
                    <DrawerHeader className="px-0">
                        <DrawerDescription className="text-xs flex gap-8 items-center">
                            <p>
                                We use our own cookies as well as third-party cookies on our websites to enhance your experience, analyze our traffic, and for security and marketing. Select "Accept All" to allow them to be used. Read our Cookie Policy.
                            </p>
                            <div className="flex gap-2">
                                <Button size="sm" className="text-xs" variant="outline" onClick={rejectAll}>Reject all</Button>
                                <Button size="sm" className="text-xs" onClick={acceptAll}>Accept all</Button>
                            </div>
                        </DrawerDescription>
                    </DrawerHeader>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
