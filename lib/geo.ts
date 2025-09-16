// lib/geo.ts

/** Normalize a UK postcode: remove spaces/punct, uppercase. */
export function normalizeUKPostcode(input: string) {
  return (input || '')
    .toUpperCase()
    .replace(/\s+/g, '')           // remove spaces
    .replace(/[^A-Z0-9]/g, '');    // strip anything else
}

/** Quick format check (keeps it simple but effective). */
export function looksLikeUKPostcode(normalized: string) {
  // Typical length after removing spaces is 5–7 (e.g. SW1A1AA, EC1A1BB, W1A0AX)
  return normalized.length >= 5 && normalized.length <= 7;
}

/**
 * Geocode a UK postcode via postcodes.io.
 * Returns { lat, lng, postcode } or null if not found/invalid.
 */
export async function geocodePostcodeUK(postcode: string): Promise<{ lat: number; lng: number; postcode: string } | null> {
  const normalized = normalizeUKPostcode(postcode);

  if (!looksLikeUKPostcode(normalized)) return null;

  try {
    // 1) Primary lookup (accepts no-space form like SW1A1AA)
    let res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(normalized)}`, { cache: 'no-store' });
    let data: any = await res.json().catch(() => null);

    if (res.ok && data?.result) {
      return { lat: data.result.latitude, lng: data.result.longitude, postcode: data.result.postcode };
    }

    // 2) If 404, check validity explicitly (returns 200 with result: true/false)
    res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(normalized)}/validate`, { cache: 'no-store' });
    data = await res.json().catch(() => null);
    if (res.ok && data?.result === false) return null; // definitely invalid

    // 3) Fallback: fuzzy search (query). Pick the top hit if available.
    res = await fetch(`https://api.postcodes.io/postcodes?query=${encodeURIComponent(normalized)}`, { cache: 'no-store' });
    data = await res.json().catch(() => null);
    const first = data?.result?.[0];
    if (first) {
      return { lat: first.latitude, lng: first.longitude, postcode: first.postcode };
    }

    return null;
  } catch (err) {
    console.log(err)
    return null; // network/other error
  }
}

/** Haversine distance in km */
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const s1 =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s1));
}
