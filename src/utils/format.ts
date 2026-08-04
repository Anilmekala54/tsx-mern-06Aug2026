/** Formats an ISO date string as dd-MM-yyyy. Returns 'Unknown' for unparsable input. */
export function formatDateDDMMYYYY(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = date.getUTCFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/** Converts a SWAPI height string (cm) to meters, e.g. "172" -> "1.72 m". */
export function heightToMeters(heightCm: string): string {
  const cm = Number(heightCm);
  if (!Number.isFinite(cm)) return 'Unknown';
  return `${(cm / 100).toFixed(2)} m`;
}

/** Formats a SWAPI mass string (kg) with thousands separators, e.g. "1,358 kg". */
export function formatMassKg(mass: string): string {
  const kg = Number(mass.replace(/,/g, ''));
  if (!Number.isFinite(kg)) return 'Unknown';
  return `${kg.toLocaleString('en-US')} kg`;
}

// A curated palette keyed by species so that recurring species (Human,
// Droid, Wookiee...) are always colored consistently, with a stable
// hash-based fallback for anything not explicitly listed.
const SPECIES_PALETTE: Record<string, string> = {
  Human: '#4FD1C5',
  Droid: '#F0B429',
  Wookiee: '#C77B4A',
  Rodian: '#68D391',
  Hutt: '#9F7AEA',
  "Yoda's species": '#63B3ED',
  Trandoshan: '#F56565',
  "Mon Calamari": '#4299E1',
  Ewok: '#ED8936',
  Sullustan: '#B794F4',
  Neimodian: '#48BB78',
  Gungan: '#38B2AC',
  Twi_lek: '#ED64A6',
  Zabrak: '#E53E3E',
};

const FALLBACK_PALETTE = ['#4FD1C5', '#F0B429', '#68D391', '#9F7AEA', '#F56565', '#4299E1', '#ED8936', '#B794F4'];

export function colorForSpecies(speciesName: string): string {
  if (SPECIES_PALETTE[speciesName]) return SPECIES_PALETTE[speciesName];
  let hash = 0;
  for (let i = 0; i < speciesName.length; i++) {
    hash = (hash * 31 + speciesName.charCodeAt(i)) >>> 0;
  }
  return FALLBACK_PALETTE[hash % FALLBACK_PALETTE.length];
}

/** Stable-ish per-character portrait via picsum's seeded endpoint. */
export function portraitUrlForId(id: string): string {
  return `https://picsum.photos/seed/${id}/480/480`;
}
