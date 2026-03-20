// Zodiac-related types (static + validation)



 // all valid zodiac sign IDs - matches API expectation: lowercase

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


 // static sign info (UI list, icons, colors, dates)

export interface ZodiacSign {
  slug: ZodiacId;
  name: string;          
  dateRange: string;     
  element: ZodiacElement;
  symbol: string;
  }


 // type guard – for dynamic routes & safety

export function isZodiacId(value: string): value is ZodiacId {
  const valid = [
    'aries','taurus','gemini','cancer','leo','virgo',
    'libra','scorpio','sagittarius','capricorn','aquarius','pisces'
  ] as const;
  return valid.includes(value.toLowerCase() as any);
}


// API response types (from freehoroscopeapi.com)


export interface HoroscopeResponse {
  data: {
    date: string;           // "2026-03-19"
    period: 'daily' | 'weekly' | 'monthly';
    sign: string;           // Capitalized: "Aries"
    horoscope: string;      // text
  };
}

export interface TarotCard {
  type: 'major' | 'minor';
  name: string;
  name_short: string;     // tex "ar01", "w01"
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


// App-specific / derived types
// For tarot info screen or daily draw

export interface TarotInsight {
  card: TarotCard;
  position?: 'upright' | 'reversed'; 
  personalInsight?: string;          
}

//future birth chart feature 

export interface BirthChartSummary {
  sunSign: ZodiacId;
  moonSign?: ZodiacId;
  ascendant?: ZodiacId;
  summary?: string;
}
