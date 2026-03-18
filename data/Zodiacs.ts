import type { ZodiacId, ZodiacSign } from "@/types";

export const zodiacSigns: ZodiacSign[] = [
	{
		id: 1,
		slug: "aries",
		name: "Aries",
		dateRange: "Mar 21 - Apr 19",
		element: "Fire",
		symbol: "♈︎",
	},
	{
		id: 2,
		slug: "taurus",
		name: "Taurus",
		dateRange: "Apr 20 - May 20",
		element: "Earth",
		symbol: "♉︎",
	},
	{
		id: 3,
		slug: "gemini",
		name: "Gemini",
		dateRange: "May 21 - Jun 20",
		element: "Air",
		symbol: "♊︎",
	},
	{
		id: 4,
		slug: "cancer",
		name: "Cancer",
		dateRange: "Jun 21 - Jul 22",
		element: "Water",
		symbol: "♋︎",
	},
	{
		id: 5,
		slug: "leo",
		name: "Leo",
		dateRange: "Jul 23 - Aug 22",
		element: "Fire",
		symbol: "♌︎",
	},
	{
		id: 6,
		slug: "virgo",
		name: "Virgo",
		dateRange: "Aug 23 - Sep 22",
		element: "Earth",
		symbol: "♍︎",
	},
	{
		id: 7,
		slug: "libra",
		name: "Libra",
		dateRange: "Sep 23 - Oct 22",
		element: "Air",
		symbol: "♎︎",
	},
	{
		id: 8,
		slug: "scorpio",
		name: "Scorpio",
		dateRange: "Oct 23 - Nov 21",
		element: "Water",
		symbol: "♏︎",
	},
	{
		id: 9,
		slug: "sagittarius",
		name: "Sagittarius",
		dateRange: "Nov 22 - Dec 21",
		element: "Fire",
		symbol: "♐︎",
	},
	{
		id: 10,
		slug: "capricorn",
		name: "Capricorn",
		dateRange: "Dec 22 - Jan 19",
		element: "Earth",
		symbol: "♑︎",
	},
	{
		id: 11,
		slug: "aquarius",
		name: "Aquarius",
		dateRange: "Jan 20 - Feb 18",
		element: "Air",
		symbol: "♒︎"
	},
	{
		id: 12,
		slug: "pisces",
		name: "Pisces",
		dateRange: "Feb 19 - Mar 20",
		element: "Water",
		symbol: "♓︎",
	},
];

export const zodiacSignsBySlug = zodiacSigns.reduce(
	(accumulator, sign) => {
		accumulator[sign.slug] = sign;
		return accumulator;
	},
	{} as Record<ZodiacId, ZodiacSign>,
);
