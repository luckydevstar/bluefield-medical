'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Loader2, X } from 'lucide-react';

type Suggestion = {
  postcode: string;
  lat: number;
  lng: number;
  district?: string | null;
  region?: string | null;
  country?: string | null;
};

function formatPostcode(raw: string) {
  const s = raw.replace(/\s+/g, '').toUpperCase();
  return s.length > 3 ? `${s.slice(0, -3)} ${s.slice(-3)}` : s;
}

export default function PostcodeAutocomplete(props: {
  value: string;
  onChange: (text: string) => void;
  onSelect: (s: Suggestion) => void;
  placeholder?: string;
}) {
  const { value, onChange, onSelect, placeholder } = props;
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<Suggestion[]>([]);
  const controller = React.useRef<AbortController | null>(null);
  const deb = React.useRef<any>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (deb.current) clearTimeout(deb.current);
    if (!value || value.trim().length < 2) {
      setItems([]);
      setOpen(false);
      return;
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

  const clearInput = () => {
    onChange('');
    setItems([]);
    setOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            ref={inputRef}
            value={value}
            placeholder={placeholder ?? 'Start typing a UK postcode…'}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => value.trim().length >= 2 && setOpen(true)}
            autoComplete="postal-code"
          />

          {/* Clear (×) button — replaces the search icon */}
          {value?.length > 0 && (
            <button
              type="button"
              aria-label="Clear"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-2 text-gray-500 hover:bg-muted"
              // Prevent input from losing focus (keeps keyboard open on mobile)
              onPointerDown={(e) => e.preventDefault()}
              onClick={clearInput}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[--radix-popover-trigger-width] p-0"
        // Keep focus on the input so the keyboard stays up
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
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
                      // Call parent with the chosen suggestion
                      onSelect(it);
                      // Format into the input, keep focus so user can type new input right away
                      onChange(formatPostcode(it.postcode));
                      setOpen(false);
                      requestAnimationFrame(() => inputRef.current?.focus());
                    }}
                  >
                    <div>
                      <div className="font-medium">{formatPostcode(it.postcode)}</div>
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
