// components/admin/LocationCombobox.tsx
'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Option = { id: string; label: string; sub?: string | null };

export default function LocationCombobox({
    value, onChange, placeholder = 'Search locations…', disabled,
}: {
    value?: string;
    onChange: (id: string | undefined, display?: string) => void;
    placeholder?: string;
    disabled?: boolean;
}) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [items, setItems] = React.useState<Option[]>([]);
    const [display, setDisplay] = React.useState<string>('');

    // Fetch label for a preselected value
    React.useEffect(() => {
        if (!value) { setDisplay(''); return; }
        (async () => {
            try {
                const res = await fetch(`/api/admin/locations?id=${encodeURIComponent(value)}`, { cache: 'no-store' });
                const json = await res.json();
                const l = (json.locations ?? [])[0];
                setDisplay(l ? `${l.name}${l.postcode ? ` (${l.postcode})` : ''}` : '');
            } catch { }
        })();
    }, [value]);

    // Typeahead search (debounced)
    React.useEffect(() => {
        let active = true;
        const q = query.trim();
        if (!q) { setItems([]); return; }
        setLoading(true);
        const t = setTimeout(async () => {
            try {
                const res = await fetch(`/api/admin/locations?q=${encodeURIComponent(q)}&limit=20`, { cache: 'no-store' });
                const json = await res.json();
                const opts: Option[] = (json.locations ?? []).map((l: any) => ({
                    id: l.id, label: l.name, sub: l.postcode,
                }));
                if (!active) return;
                setItems(opts);
            } finally { setLoading(false); }
        }, 200);
        return () => { active = false; clearTimeout(t); };
    }, [query]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between" disabled={disabled}>
                    {display || 'Select a location'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[360px]">
                <Command shouldFilter={false}>
                    <CommandInput placeholder={placeholder} onValueChange={setQuery} />
                    <CommandList>
                        {loading && <CommandEmpty>Searching…</CommandEmpty>}
                        {!loading && items.length === 0 && <CommandEmpty>No results.</CommandEmpty>}
                        <CommandGroup>
                            {items.map((opt) => (
                                <CommandItem
                                    key={opt.id}
                                    value={opt.id}
                                    onSelect={(v) => {
                                        const chosen = items.find((i) => i.id === v);
                                        setDisplay(chosen ? `${chosen.label}${chosen.sub ? ` (${chosen.sub})` : ''}` : '');
                                        onChange(v, chosen?.label);
                                        setOpen(false);
                                    }}
                                >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    <div className="flex-1">
                                        <div className="text-sm">{opt.label}</div>
                                        {opt.sub && <div className="text-xs text-muted-foreground">{opt.sub}</div>}
                                    </div>
                                    <Check className={cn('h-4 w-4', value === opt.id ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
