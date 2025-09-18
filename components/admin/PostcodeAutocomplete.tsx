'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Loader2, Search } from 'lucide-react';

type Suggestion = { postcode: string; lat: number; lng: number; district?: string | null; region?: string | null; country?: string | null; };

export default function PostcodeAutocomplete(props: {
  value: string;
  onChange: (text: string) => void;               // called on typing
  onSelect: (s: Suggestion) => void;              // called when user picks a suggestion
  placeholder?: string;
}) {
  const { value, onChange, onSelect, placeholder } = props;
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<Suggestion[]>([]);
  const controller = React.useRef<AbortController | null>(null);
  const deb = React.useRef<any>(null);

  React.useEffect(() => {
    // fetch suggestions (debounced)
    if (deb.current) clearTimeout(deb.current);
    if (!value || value.trim().length < 2) {
      setItems([]); return;
    }
    deb.current = setTimeout(async () => {
      try {
        controller.current?.abort();
        controller.current = new AbortController();
        setLoading(true);
        const res = await fetch(`/api/uk-postcodes?q=${encodeURIComponent(value.trim())}`, {
          cache: 'no-store',
          signal: controller.current.signal,
        });
        const json = await res.json();
        setItems(json.results ?? []);
        setOpen(true);
      } catch {
        /* ignored */
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => deb.current && clearTimeout(deb.current);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={value}
            placeholder={placeholder ?? 'Start typing a UK postcode…'}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => value.trim().length >= 2 && setOpen(true)}
            autoComplete="off"
          />
          <Search className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[--radix-popover-trigger-width] p-0"
      >
        <Command>
          <CommandList>
            {loading && (
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching…
              </div>
            )}
            {!loading && <CommandEmpty>No matches</CommandEmpty>}
            {!loading && items.length > 0 && (
              <CommandGroup heading="Postcodes">
                {items.map((it) => (
                  <CommandItem
                    key={it.postcode}
                    value={it.postcode}
                    onSelect={() => {
                      onSelect(it);
                      setOpen(false);
                    }}
                  >
                    <div>
                      <div className="font-medium">{it.postcode}</div>
                      <div className="text-xs text-gray-500">
                        {[it.district, it.region, it.country].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
