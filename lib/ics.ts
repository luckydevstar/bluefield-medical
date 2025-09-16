// lib/ics.ts
function pad(n: number) { return n.toString().padStart(2, '0'); }
function toIcsDateUTC(d: Date) {
  const y = d.getUTCFullYear();
  const m = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  const h = pad(d.getUTCHours());
  const min = pad(d.getUTCMinutes());
  const s = pad(d.getUTCSeconds());
  return `${y}${m}${day}T${h}${min}${s}Z`;
}

function escapeText(s?: string) {
  return (s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

type IcsOpts = {
  title: string;
  description?: string;
  location?: string;
  startUtc: Date;
  endUtc: Date;
  uid?: string;        // stable id (e.g., booking-<id>@yourdomain)
  sequence?: number;   // increment if rescheduling the same UID
  organizerEmail?: string; // optional ORGANIZER line
};

export function makeIcs(opts: IcsOpts) {
  const uid = opts.uid ?? `bluefield-${Math.random().toString(36).slice(2)}@app`;
  const seq = Number.isFinite(opts.sequence) ? opts.sequence : 0;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bluefield//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `SEQUENCE:${seq}`,
    `DTSTAMP:${toIcsDateUTC(new Date())}`,
    `DTSTART:${toIcsDateUTC(opts.startUtc)}`,
    `DTEND:${toIcsDateUTC(opts.endUtc)}`,
    `SUMMARY:${escapeText(opts.title)}`,
    `DESCRIPTION:${escapeText(opts.description)}`,
    opts.location ? `LOCATION:${escapeText(opts.location)}` : undefined,
    opts.organizerEmail ? `ORGANIZER:mailto:${opts.organizerEmail}` : undefined,
    'END:VEVENT',
    'END:VCALENDAR',
    '' // trailing newline
  ].filter(Boolean);

  return lines.join('\r\n');
}