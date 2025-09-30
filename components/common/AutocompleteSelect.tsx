'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, Check, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

type Option = { value: string; label: string; sub?: string | null };

export default function AutocompleteSelect({
    value,
    onChange,
    options,
    placeholder = 'Search…',
    disabled,
}: {
    value?: string;
    onChange: (value: string | undefined) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
}) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');

    const selected = options.find((o) => o.value === value);
    const display = selected ? `${selected.label}${selected.sub ? ` (${selected.sub})` : ''}` : 'Select…';

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter((o) => (`${o.label} ${o.sub ?? ''}`).toLowerCase().includes(q));
    }, [options, query]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between" disabled={disabled}>
                    {display}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[360px]">
                <Command shouldFilter={false}>
                    <CommandInput placeholder={placeholder} value={query} onValueChange={setQuery} />
                    <CommandList>
                        <CommandEmpty>No results.</CommandEmpty>
                        <CommandGroup>
                            {filtered.map((opt) => (
                                <CommandItem
                                    key={opt.value}
                                    value={opt.value}
                                    onSelect={(v) => { onChange(v); setOpen(false); }}
                                >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    <div className="flex-1">
                                        <div className="text-sm">{opt.label}</div>
                                        {opt.sub && <div className="text-xs text-muted-foreground">{opt.sub}</div>}
                                    </div>
                                    <Check className={cn('h-4 w-4', value === opt.value ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
