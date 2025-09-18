export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type LocationRow =
  | { id: string; name: string; postcode: string | null; lat: number | null; lng: number | null }
  | null
  | undefined;

function normalizeLocation(loc: unknown): LocationRow {
  // Supabase can occasionally return the relation as an array; collapse to first item
  if (Array.isArray(loc)) {
    const first = loc[0];
    if (!first) return null;
    return {
      id: String(first.id),
      name: String(first.name ?? ''),
      postcode: first.postcode ?? null,
      lat: typeof first.lat === 'number' ? first.lat : first.lat != null ? Number(first.lat) : null,
      lng: typeof first.lng === 'number' ? first.lng : first.lng != null ? Number(first.lng) : null,
    };
  }
  if (loc && typeof loc === 'object') {
    const o = loc as any;
    return {
      id: String(o.id),
      name: String(o.name ?? ''),
      postcode: o.postcode ?? null,
      lat: typeof o.lat === 'number' ? o.lat : o.lat != null ? Number(o.lat) : null,
      lng: typeof o.lng === 'number' ? o.lng : o.lng != null ? Number(o.lng) : null,
    };
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get('days') ?? 60);

    const to = new Date(now);
    to.setDate(to.getDate() + days);
    const toStr = to.toISOString().slice(0, 10);

    // 1) Service days within window (include location)
    const { data: daysData, error: daysErr } = await supabaseAdmin
      .from('service_days')
      .select(`
        id,
        service_date,
        window_start,
        window_end,
        location_id,
        locations ( id, name, postcode, lat, lng )
      `)
      .gte('service_date', todayStr)
      .lte('service_date', toStr)
      .order('service_date', { ascending: true });

    if (daysErr) return NextResponse.json({ error: daysErr.message }, { status: 500 });

    // Normalize location (handles array vs object)
    const serviceDays = (daysData ?? [])
      .map((d: any) => ({
        ...d,
        locations: normalizeLocation(d.locations),
      }))
      .filter((d: any) => !!d.locations);

    if (serviceDays.length === 0) {
      return NextResponse.json({ results: [], from: todayStr, to: toStr });
    }

    const dayIds = serviceDays.map((d: any) => d.id);

    // 2) OPEN slots for those days, only ones with end in the future
    const nowISO = now.toISOString();
    const { data: slotsData, error: slotsErr } = await supabaseAdmin
      .from('slots')
      .select('id, service_day_id, start_utc, end_utc, status')
      .in('service_day_id', dayIds)
      .eq('status', 'OPEN')
      .gt('end_utc', nowISO) // still upcoming (future end)
      .order('start_utc', { ascending: true });

    if (slotsErr) return NextResponse.json({ error: slotsErr.message }, { status: 500 });

    const slotsByDay = new Map<string, { start_utc: string; end_utc: string }[]>();
    for (const s of slotsData ?? []) {
      const arr = slotsByDay.get(s.service_day_id) ?? [];
      arr.push({ start_utc: s.start_utc, end_utc: s.end_utc });
      slotsByDay.set(s.service_day_id, arr);
    }

    type DayAvail = {
      locationId: string;
      name: string;
      postcode: string | null;
      lat: number | null;
      lng: number | null;
      service_date: string;
      minStartUtc: string;
      maxEndUtc: string;
    };

    const dayAvailList: DayAvail[] = [];
    for (const d of serviceDays) {
      const slots = slotsByDay.get(d.id) ?? [];
      if (slots.length === 0) continue;

      let minStart = slots[0].start_utc;
      let maxEnd = slots[0].end_utc;
      for (const s of slots) {
        if (s.start_utc < minStart) minStart = s.start_utc;
        if (s.end_utc > maxEnd) maxEnd = s.end_utc;
      }

      dayAvailList.push({
        locationId: String(d.location_id),
        name: d.locations!.name,
        postcode: d.locations!.postcode,
        lat: d.locations!.lat,
        lng: d.locations!.lng,
        service_date: d.service_date,
        minStartUtc: minStart,
        maxEndUtc: maxEnd,
      });
    }

    // Reduce to earliest date per location
    const byLoc = new Map<string, DayAvail>();
    for (const row of dayAvailList) {
      const ex = byLoc.get(row.locationId);
      if (!ex || row.service_date < ex.service_date) {
        byLoc.set(row.locationId, row);
      } else if (row.service_date === ex.service_date) {
        if (row.minStartUtc < ex.minStartUtc) ex.minStartUtc = row.minStartUtc;
        if (row.maxEndUtc > ex.maxEndUtc) ex.maxEndUtc = row.maxEndUtc;
      }
    }

    const results = Array.from(byLoc.values()).sort((a, b) =>
      a.service_date.localeCompare(b.service_date)
    );

    return NextResponse.json({ results, from: todayStr, to: toStr });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'failed' }, { status: 500 });
  }
}
