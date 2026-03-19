/**
 * Static zodiac sign data used for UI rendering, navigation, and validation.
 * This data is universal and does not change, so it's safe to keep locally.
 * IDs match exactly what the freehoroscopeapi.com expects (lowercase English).
 */
  
export const zodiacSigns = [
    { id: 'aries',      name: 'Aries',      emoji: '♈︎', dates: 'Mar 21 – Apr 19', element: 'fire', slug: 'aries' },
    { id: 'taurus',     name: 'Taurus',     emoji: '♉︎', dates: 'Apr 20 – May 20',   element: 'earth', slug: 'taurus' },
    { id: 'gemini',     name: 'Gemini',     emoji: '♊︎', dates: 'May 21 – Jun 20',    element: 'air', slug: 'gemini' },
    { id: 'cancer',     name: 'Cancer',     emoji: '♋︎', dates: 'Jun 21 – Jul 22',   element: 'water', slug: 'cancer' },
    { id: 'leo',        name: 'Leo',        emoji: '♌︎', dates: 'Jul 23 – Aug 22', element: 'fire', slug: 'leo' },
    { id: 'virgo',      name: 'Virgo',      emoji: '♍︎', dates: 'Aug 23 – Sep 22', element: 'earth', slug: 'virgo' },
    { id: 'libra',      name: 'Libra',      emoji: '♎︎', dates: 'Sep 23 – Oct 22', element: 'air', slug: 'libra' },
    { id: 'scorpio',    name: 'Scorpio',    emoji: '♏︎', dates: 'Oct 23 – Nov 21', element: 'water', slug: 'scorpio' },
    { id: 'sagittarius',name: 'Sagittarius',emoji: '♐︎', dates: 'Nov 22 – Dec 21', element: 'fire', slug: 'sagittarius' },
    { id: 'capricorn',  name: 'Capricorn',  emoji: '♑︎', dates: 'Dec 22 – Jan 19', element: 'earth', slug: 'capricorn' },
    { id: 'aquarius',   name: 'Aquarius',   emoji: '♒︎', dates: 'Jan 20 – Feb 18', element: 'air', slug: 'aquarius' },
    { id: 'pisces',     name: 'Pisces',     emoji: '♓︎', dates: 'Feb 19 – Mar 20', element: 'water', slug: 'pisces' },
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
  // Use color hex values (applied as inline styles) to avoid depending on Tailwind's color palette
  fire: '#F97316',      // orange-500
  earth: '#16A34A',     // emerald-600
  air: '#06B6D4',       // cyan-500
  water: '#3B82F6',     // blue-500
};

/**
 * Type guard to validate if a string is a valid zodiac ID
 * Useful for dynamic routes and API responses
 */
export function isValidZodiacId(id: string): id is ZodiacId {
  return id.toLowerCase() in zodiacById;
}