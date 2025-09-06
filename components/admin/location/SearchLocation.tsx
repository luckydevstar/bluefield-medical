'use client';

import { Input } from '@/components/ui/input';
import * as React from 'react';

type Picked = { postcode: string; lat: number; lon: number; name: string };

export default function UKPostcodeAutocomplete({
  placeholder = 'Enter UK postcode',
  max = 12,
  className,
  onPick,
}: {
  placeholder?: string;
  max?: number;
  className?: string;
  onPick: (v: Picked) => void;
}) {
  const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<
    { id: string; postcode: string; label: string; name: string; lat: number; lon: number }[]
  >([]);
  const [active, setActive] = React.useState(0);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // fetch from postcodes.io
  React.useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setItems([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const t = setTimeout(async () => {
      try {
        const url = `https://api.postcodes.io/postcodes?q=${encodeURIComponent(q)}&limit=${max}`;
        const r = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });
        if (!r.ok) {
          if (!cancelled) setItems([]);
          return;
        }
        const j = await r.json();
        const seen = new Set<string>();
        const list = (j?.result ?? [])
          .map((p: any) => {
            const name =
              p.admin_district ||
              p.parish ||
              p.region ||
              p.nuts ||
              p.country ||
              '';
            return {
              id: p.postcode,
              postcode: p.postcode,
              name,
              label: `${p.postcode} — ${name}`,
              lat: Number(p.latitude),
              lon: Number(p.longitude),
            };
          })
          // de-dupe by postcode
          .filter((r: any) => (seen.has(r.postcode) ? false : seen.add(r.postcode)));

        if (!cancelled) {
          setItems(list);
          setActive(0);
          setOpen(true);
        }
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [value, max]);

  const choose = (s: { postcode: string; lat: number; lon: number; name: string }) => {
    setValue(s.postcode);
    setOpen(false);
    onPick({ postcode: s.postcode, lat: s.lat, lon: s.lon, name: s.name });
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open || items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const s = items[active];
      if (s) choose(s);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className={`relative ${className ?? ''}`}>
      <Input
        role="combobox"
        aria-expanded={open}
        className="w-full border rounded-md px-3 py-2 outline-none focus:ring"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => value.trim().length >= 2 && setOpen(true)}
        onKeyDown={onKeyDown}
        autoComplete="off"
        inputMode="search"
      />

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow">
          {loading && (
            <div className="px-3 py-2 text-sm text-muted-foreground">Searching…</div>
          )}
          {!loading && items.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">No matching postcodes</div>
          )}
          {!loading && items.length > 0 && (
            <ul className="max-h-72 overflow-auto py-1">
              {items.map((s, i) => (
                <li
                  key={s.id}
                  className={`cursor-pointer px-3 py-2 text-sm ${
                    i === active ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(s);
                  }}
                  onMouseEnter={() => setActive(i)}
                >
                  <div className="flex justify-between gap-3">
                    <span className="font-medium">{s.postcode}</span>
                    <span className="text-xs opacity-70">{s.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
