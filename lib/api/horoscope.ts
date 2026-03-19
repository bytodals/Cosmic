import { HoroscopeResponse } from "@/lib/types";
import { ZodiacId } from "@/lib/types";

/**
 * Base URL for the API
 */
const BASE_URL = 'https://freehoroscopeapi.com/api/v1';

/**
 * Fetch today's horoscope for a given zodiac sign
 * @param sign - Zodiac sign ID (lowercase, e.g. 'aries')
 * @returns Horoscope data or throws error
 */
export async function fetchDailyHoroscope(sign: ZodiacId): Promise<HoroscopeResponse['data']> {
  try {
    const url = `${BASE_URL}/get-horoscope/daily?sign=${encodeURIComponent(sign)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const json: HoroscopeResponse = await response.json();

    // Basic runtime validation (VG robustness)
    if (!json.data || !json.data.horoscope || !json.data.sign) {
      throw new Error('Invalid response format from horoscope API');
    }

    return json.data;
  } catch (error) {
    console.error('Failed to fetch daily horoscope:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Unknown error fetching horoscope');
  }
}

/**
 * Optional: fetch weekly or monthly (for extra functionality / toggle)
 */
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