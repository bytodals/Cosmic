import { HoroscopeResponse } from "@/lib/types";
import { ZodiacId } from "@/lib/types";

// Base URL for the API 
const BASE_URL = 'https://freehoroscopeapi.com/api/v1';


 //Fetch today's horoscope for a given zodiac sign
 // Accepts both API shapes: { data: {...} } and { horoscope, sign, date }

export async function fetchDailyHoroscope(sign: ZodiacId): Promise<HoroscopeResponse['data']> {
  const s = String(sign || '').toLowerCase();
  try {
    const url = `${BASE_URL}/get-horoscope/daily?sign=${encodeURIComponent(s)}`;
    const response = await fetch(url);

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`API error: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`);
    }

    const jsonRaw: any = await response.json();

    // If API returns the expected shape with data wrapper
    if (jsonRaw && jsonRaw.data && jsonRaw.data.horoscope && jsonRaw.data.sign) {
      return jsonRaw.data as HoroscopeResponse['data'];
    }

    // Some deployments return fields, horoscope/sign/date
    if (jsonRaw && (jsonRaw.horoscope || jsonRaw.sign)) {
      return {
        date: jsonRaw.date || new Date().toISOString().split('T')[0],
        period: 'daily',
        sign: jsonRaw.sign || s,
        horoscope: (jsonRaw.horoscope || '').toString(),
      } as HoroscopeResponse['data'];
    }

    throw new Error('Invalid response format from horoscope API');
  } catch (error) {
    console.error('Failed to fetch daily horoscope:', error);
    throw error instanceof Error ? error : new Error('Unknown error fetching horoscope');
  }
}

export async function fetchPeriodHoroscope(
  sign: ZodiacId,
  period: 'weekly' | 'monthly'
): Promise<HoroscopeResponse['data']> {
  try {
    const url = `${BASE_URL}/get-horoscope/${period}?sign=${encodeURIComponent(sign)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const json: HoroscopeResponse = await response.json();

    if (!json.data || !json.data.horoscope || !json.data.sign) {
      throw new Error('Invalid response format from horoscope API');
    }

    return json.data;
  } catch (error) {
    console.error(`Failed to fetch ${period} horoscope:`, error);
    throw error instanceof Error
      ? error
      : new Error(`Unknown error fetching ${period} horoscope`);
  }
}