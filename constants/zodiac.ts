// All static zodiac data and types in one place.

export type ElementType = 'fire' | 'earth' | 'air' | 'water';

export interface ZodiacSign {
  id: string;
  name: string;
  dates: string;
  element: ElementType;
}

export const zodiacSigns: ZodiacSign[] = [
  { id: 'aries', name: 'Aries', dates: 'March 21 – April 19', element: 'fire' },
  { id: 'taurus', name: 'Taurus', dates: 'April 20 – May 20', element: 'earth' },
  { id: 'gemini', name: 'Gemini', dates: 'May 21 – June 20', element: 'air' },
  { id: 'cancer', name: 'Cancer', dates: 'June 21 – July 22', element: 'water' },
  { id: 'leo', name: 'Leo', dates: 'July 23 – August 22', element: 'fire' },
  { id: 'virgo', name: 'Virgo', dates: 'August 23 – September 22', element: 'earth' },
  { id: 'libra', name: 'Libra', dates: 'September 23 – October 22', element: 'air' },
  { id: 'scorpio', name: 'Scorpio', dates: 'October 23 – November 21', element: 'water' },
  { id: 'sagittarius', name: 'Sagittarius', dates: 'November 22 – December 21', element: 'fire' },
  { id: 'capricorn', name: 'Capricorn', dates: 'December 22 – January 19', element: 'earth' },
  { id: 'aquarius', name: 'Aquarius', dates: 'January 20 – February 18', element: 'air' },
  { id: 'pisces', name: 'Pisces', dates: 'February 19 – March 20', element: 'water' },
];

export const elementColors: Record<ElementType, string> = {
  fire: 'text-orange-400',
  earth: 'text-emerald-400',
  air: 'text-sky-400',
  water: 'text-violet-400',
};