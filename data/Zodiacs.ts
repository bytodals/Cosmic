/**
 * Static zodiac sign data used for UI rendering, navigation, and validation.
 * This data is universal and does not change, so it's safe to keep locally.
 * IDs match exactly what the freehoroscopeapi.com expects (lowercase English).
 */
  
export const zodiacSigns = [
    { id: 'aries',      name: 'Aries',      emoji: '♈︎', dates: 'March 21 – April 19', element: 'fire', slug: 'aries' },
    { id: 'taurus',     name: 'Taurus',     emoji: '♉︎', dates: 'April 20 – May 20',   element: 'earth', slug: 'taurus' },
    { id: 'gemini',     name: 'Gemini',     emoji: '♊︎', dates: 'May 21 – June 20',    element: 'air', slug: 'gemini' },
    { id: 'cancer',     name: 'Cancer',     emoji: '♋︎', dates: 'June 21 – July 22',   element: 'water', slug: 'cancer' },
    { id: 'leo',        name: 'Leo',        emoji: '♌︎', dates: 'July 23 – August 22', element: 'fire', slug: 'leo' },
    { id: 'virgo',      name: 'Virgo',      emoji: '♍︎', dates: 'August 23 – September 22', element: 'earth', slug: 'virgo' },
    { id: 'libra',      name: 'Libra',      emoji: '♎︎', dates: 'September 23 – October 22', element: 'air', slug: 'libra' },
    { id: 'scorpio',    name: 'Scorpio',    emoji: '♏︎', dates: 'October 23 – November 21', element: 'water', slug: 'scorpio' },
    { id: 'sagittarius',name: 'Sagittarius',emoji: '♐︎', dates: 'November 22 – December 21', element: 'fire', slug: 'sagittarius' },
    { id: 'capricorn',  name: 'Capricorn',  emoji: '♑︎', dates: 'December 22 – January 19', element: 'earth', slug: 'capricorn' },
    { id: 'aquarius',   name: 'Aquarius',   emoji: '♒︎', dates: 'January 20 – February 18', element: 'air', slug: 'aquarius' },
    { id: 'pisces',     name: 'Pisces',     emoji: '♓︎', dates: 'February 19 – March 20', element: 'water', slug: 'pisces' },
  ] as const;
/**
 * Type representing a single zodiac sign object
 */
export type ZodiacSign = (typeof zodiacSigns)[number];

/**
 * Union type of all valid zodiac IDs (used for props, params, validation)
 */
export type ZodiacId = ZodiacSign['id'];

/**
 * Quick lookup map for O(1) access by ID
 */
export const zodiacById: Record<ZodiacId, ZodiacSign> = 
  Object.fromEntries(
    zodiacSigns.map((sign) => [sign.id, sign])
  ) as Record<ZodiacId, ZodiacSign>;

/**
 * Tailwind classes for coloring elements based on zodiac element
 * Used in ZodiacCard component
 */
export const elementColors: Record<ZodiacSign['element'], string> = {
  fire: 'text-red-400',
  earth: 'text-emerald-500',
  air: 'text-cyan-300',
  water: 'text-blue-300',
};

/**
 * Type guard to validate if a string is a valid zodiac ID
 * Useful for dynamic routes and API responses
 */
export function isValidZodiacId(id: string): id is ZodiacId {
  return id.toLowerCase() in zodiacById;
}