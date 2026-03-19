// ───────────────────────────────────────────────
// Zodiac-related types (static + validation)
// ───────────────────────────────────────────────

/**
 * Literal union of all valid zodiac sign IDs (exactly matches API expectation: lowercase)
 */
export type ZodiacId =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

export type ZodiacElement = 'Fire' | 'Earth' | 'Air' | 'Water';

/**
 * static sign info (used for UI list, icons, colors, dates)
 */
export interface ZodiacSign {
  slug: ZodiacId;
  name: string;          
  dateRange: string;     
  element: ZodiacElement;
  symbol: string;
  }

/**
 * Type guard – very useful for dynamic routes & safety
 */
export function isZodiacId(value: string): value is ZodiacId {
  const valid = [
    'aries','taurus','gemini','cancer','leo','virgo',
    'libra','scorpio','sagittarius','capricorn','aquarius','pisces'
  ] as const;
  return valid.includes(value.toLowerCase() as any);
}

// ───────────────────────────────────────────────
// API response types (from freehoroscopeapi.com)
// ───────────────────────────────────────────────

export interface HoroscopeResponse {
  data: {
    date: string;           // "2026-03-19"
    period: 'daily' | 'weekly' | 'monthly';
    sign: string;           // Capitalized: "Aries"
    horoscope: string;      // The text content
  };
}

export interface TarotCard {
  type: 'major' | 'minor';
  name: string;
  name_short: string;     // e.g. "ar01", "w01"
  value?: string;
  value_int?: number;
  meaning_up: string;
  meaning_rev: string;
  desc: string;
  suit?: string;          // "wands", "cups", "swords", "pentacles" for minor
}

export interface TarotResponse {
  nhits: number;
  cards: TarotCard[];
}

// ───────────────────────────────────────────────
// App-specific / derived types (extra functionality)
// ───────────────────────────────────────────────

/**
 * For tarot info screen or daily draw
 */
export interface TarotInsight {
  card: TarotCard;
  position?: 'upright' | 'reversed'; // optional – you can add logic
  personalInsight?: string;          // generated or static
}

/**
 * For future birth chart feature (if you expand)
 */
export interface BirthChartSummary {
  sunSign: ZodiacId;
  moonSign?: ZodiacId;
  ascendant?: ZodiacId;
  summary?: string;
}

// Optional: if you want to add overviews later (static or from another source)
export interface ZodiacOverview {
  sign: ZodiacId;
  strengths: string[];
  challenges: string[];
  compatibility: ZodiacId[]; // or string[]
  luckyColor?: string;
  luckyNumbers?: number[];
}