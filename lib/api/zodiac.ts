import { zodiacById } from "@/data/Zodiacs";
import { fetchBirthChartSummary } from "@/lib/api";
import { fetchDailyHoroscope } from "./horoscope";

const BASE_URL = 'https://freehoroscopeapi.com/api/v1';

export type ZodiacInfo = {
  name?: string;
  dates?: string;
  element?: string;
  description?: string;
  strengths?: string[];
  challenges?: string[];
  compatibility?: string[];
};

export async function fetchZodiacInfo(signId: string): Promise<ZodiacInfo> {
  try {
    const url = `${BASE_URL}/zodiac/info?sign=${encodeURIComponent(signId)}`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      // try to map known fields
      return {
        name: json.name || undefined,
        dates: json.dates || undefined,
        element: json.element || undefined,
        description: json.description || json.overview || undefined,
        strengths: json.strengths || undefined,
        challenges: json.challenges || undefined,
        compatibility: json.compatibility || undefined,
      };
    }
  } catch (err) {
    // ignore and fallback to local
    console.warn('Zodiac info fetch failed, using local data fallback', err);
  }

  // fallback to local static data
  const local = (zodiacById as any)[signId];
  if (!local) return {};
  return {
    name: local.name,
    dates: local.dates,
    element: local.element,
    description: undefined,
  };
}

export async function generatePersonalizedHoroscope(signId: string, details?: {
  fullName?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
}) {
  // Try API endpoint for personalized horoscope (best-effort)
  try {
    const url = `${BASE_URL}/get-horoscope/personal`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sign: signId, ...details }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json && (json.horoscope || json.data?.horoscope)) {
        return (json.horoscope || json.data.horoscope).toString();
      }
    }
  } catch (err) {
    // ignore and fallback below
    console.warn('Personalized horoscope API failed, falling back', err);
  }

  // Fallback: combine generic daily horoscope with birth chart summary (best-effort)
  try {
    const generic = await fetchDailyHoroscope(signId as any).catch(() => null);
    let genericText = generic?.horoscope ?? '';

    if (details?.birthDate || details?.birthPlace) {
      const summary = await fetchBirthChartSummary({
        birthDate: details.birthDate || '',
        birthTime: details.birthTime || '12:00',
        birthPlace: details.birthPlace || '',
      }).catch(() => null as any);

      const moon = summary?.moonSign;
      const asc = summary?.ascendantSign;

      const personalized = `${details?.fullName ? `Hi ${details.fullName}. ` : ''}As a ${signId} ${moon ? `with Moon in ${moon}` : ''}${asc ? ` and Rising in ${asc}` : ''}, today: ${genericText}`;
      return personalized;
    }

    return genericText || 'No horoscope available.';
  } catch (err) {
    console.warn('Fallback horoscope generation failed', err);
    return 'No horoscope available.';
  }
}
