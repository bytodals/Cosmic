export type ZodiacId =
	| "aries"
	| "taurus"
	| "gemini"
	| "cancer"
	| "leo"
	| "virgo"
	| "libra"
	| "scorpio"
	| "sagittarius"
	| "capricorn"
	| "aquarius"
	| "pisces";

export type ZodiacElement = "Fire" | "Earth" | "Air" | "Water";

export interface ZodiacSign {
	id: number;
	slug: ZodiacId;
	name: string;
	dateRange: string;
	element: ZodiacElement;
	symbol: string;
}

export interface TarotCard {
	name: string;
	meaning: string;
	keywords?: string[];
	reversedMeaning?: string;
	arcana?: "major" | "minor";
}

export interface ZodiacOverview {
	sign: ZodiacId;
	title: string;
	overview: string;
	strengths: string[];
	challenges: string[];
	compatibility: string[];
	luckyColor?: string;
	luckyDay?: string;
	luckyNumbers?: string[];
}

export interface DailyTarotInsight {
	card: TarotCard;
	insight: string;
}

export interface BirthChartSummary {
	moonSign: string;
	ascendantSign: string;
	summary?: string;
}
