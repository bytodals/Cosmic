import { zodiacSignsBySlug } from "@/data/Zodiacs";
import type {
  BirthChartSummary,
  DailyTarotInsight,
  TarotCard,
  ZodiacId,
  ZodiacOverview,
} from "@/types";
import type { BirthDetails } from "./birthDetailsStorage";

type JsonRecord = Record<string, unknown>;

const HOROSCOPE_API_BASE_URL =
  process.env.EXPO_PUBLIC_HOROSCOPE_API_BASE_URL?.trim().replace(/\/$/, "") ||
  "https://freehoroscopeapi.com";

const HOROSCOPE_API_KEY = process.env.EXPO_PUBLIC_HOROSCOPE_API_KEY?.trim();

const ASTRO_API_BASE_URL =
  process.env.EXPO_PUBLIC_ASTRO_API_BASE_URL?.trim().replace(/\/$/, "") ||
  HOROSCOPE_API_BASE_URL;

const ASTRO_API_KEY =
  process.env.EXPO_PUBLIC_ASTRO_API_KEY?.trim() || HOROSCOPE_API_KEY;

const ZODIAC_FALLBACKS: Record<ZodiacId, ZodiacOverview> = {
  aries: {
    sign: "aries",
    title: "Aries",
    overview:
      "Aries is bold, direct and action-driven. You usually thrive when you can lead, start fresh projects and trust your instincts.",
    strengths: ["Courageous", "Energetic", "Independent"],
    challenges: ["Impulsive", "Impatient", "Competitive"],
    compatibility: ["Leo", "Sagittarius", "Gemini"],
    luckyColor: "Crimson",
    luckyDay: "Tuesday",
    luckyNumbers: ["1", "9", "17"],
  },
  taurus: {
    sign: "taurus",
    title: "Taurus",
    overview:
      "Taurus is grounded, loyal and comfort-oriented. You shine when life feels stable and your values are respected.",
    strengths: ["Reliable", "Patient", "Practical"],
    challenges: ["Stubborn", "Resistant to change", "Possessive"],
    compatibility: ["Virgo", "Capricorn", "Cancer"],
    luckyColor: "Emerald",
    luckyDay: "Friday",
    luckyNumbers: ["2", "6", "24"],
  },
  gemini: {
    sign: "gemini",
    title: "Gemini",
    overview:
      "Gemini is curious, adaptable and social. You do your best when you can learn, connect and keep things dynamic.",
    strengths: ["Communicative", "Quick-thinking", "Versatile"],
    challenges: ["Restless", "Inconsistent", "Overthinking"],
    compatibility: ["Libra", "Aquarius", "Aries"],
    luckyColor: "Yellow",
    luckyDay: "Wednesday",
    luckyNumbers: ["5", "14", "23"],
  },
  cancer: {
    sign: "cancer",
    title: "Cancer",
    overview:
      "Cancer is intuitive, caring and protective. Emotional security and trusted relationships are your superpowers.",
    strengths: ["Empathetic", "Loyal", "Nurturing"],
    challenges: ["Moody", "Sensitive", "Withdrawn"],
    compatibility: ["Scorpio", "Pisces", "Taurus"],
    luckyColor: "Silver",
    luckyDay: "Monday",
    luckyNumbers: ["2", "7", "11"],
  },
  leo: {
    sign: "leo",
    title: "Leo",
    overview:
      "Leo is expressive, generous and charismatic. You glow when you can create, inspire and lead with heart.",
    strengths: ["Confident", "Warm", "Creative"],
    challenges: ["Proud", "Dramatic", "Attention-seeking"],
    compatibility: ["Aries", "Sagittarius", "Libra"],
    luckyColor: "Gold",
    luckyDay: "Sunday",
    luckyNumbers: ["1", "10", "19"],
  },
  virgo: {
    sign: "virgo",
    title: "Virgo",
    overview:
      "Virgo is analytical, thoughtful and detail-oriented. You excel when there is a clear plan and a useful purpose.",
    strengths: ["Organized", "Helpful", "Precise"],
    challenges: ["Perfectionistic", "Critical", "Worried"],
    compatibility: ["Taurus", "Capricorn", "Cancer"],
    luckyColor: "Navy",
    luckyDay: "Wednesday",
    luckyNumbers: ["3", "15", "27"],
  },
  libra: {
    sign: "libra",
    title: "Libra",
    overview:
      "Libra is balanced, diplomatic and harmony-seeking. You thrive in collaboration and environments with beauty and fairness.",
    strengths: ["Charming", "Fair-minded", "Cooperative"],
    challenges: ["Indecisive", "People-pleasing", "Avoidant"],
    compatibility: ["Gemini", "Aquarius", "Leo"],
    luckyColor: "Sky Blue",
    luckyDay: "Friday",
    luckyNumbers: ["6", "15", "24"],
  },
  scorpio: {
    sign: "scorpio",
    title: "Scorpio",
    overview:
      "Scorpio is focused, magnetic and deeply intuitive. You are strongest when you trust your instincts and commit fully.",
    strengths: ["Passionate", "Determined", "Insightful"],
    challenges: ["Secretive", "Intense", "Jealous"],
    compatibility: ["Cancer", "Pisces", "Virgo"],
    luckyColor: "Burgundy",
    luckyDay: "Tuesday",
    luckyNumbers: ["8", "11", "22"],
  },
  sagittarius: {
    sign: "sagittarius",
    title: "Sagittarius",
    overview:
      "Sagittarius is adventurous, optimistic and freedom-loving. You flourish when you can explore, learn and stay inspired.",
    strengths: ["Honest", "Adventurous", "Visionary"],
    challenges: ["Blunt", "Impatient", "Commitment-shy"],
    compatibility: ["Aries", "Leo", "Aquarius"],
    luckyColor: "Purple",
    luckyDay: "Thursday",
    luckyNumbers: ["3", "12", "30"],
  },
  capricorn: {
    sign: "capricorn",
    title: "Capricorn",
    overview:
      "Capricorn is strategic, responsible and ambitious. You shine in long-term goals, discipline and steady growth.",
    strengths: ["Disciplined", "Dependable", "Goal-focused"],
    challenges: ["Rigid", "Reserved", "Workaholic"],
    compatibility: ["Taurus", "Virgo", "Scorpio"],
    luckyColor: "Charcoal",
    luckyDay: "Saturday",
    luckyNumbers: ["4", "8", "26"],
  },
  aquarius: {
    sign: "aquarius",
    title: "Aquarius",
    overview:
      "Aquarius is innovative, original and future-minded. You thrive where ideas, community and independence intersect.",
    strengths: ["Inventive", "Open-minded", "Humanitarian"],
    challenges: ["Detached", "Unpredictable", "Stubborn"],
    compatibility: ["Gemini", "Libra", "Sagittarius"],
    luckyColor: "Electric Blue",
    luckyDay: "Saturday",
    luckyNumbers: ["4", "13", "22"],
  },
  pisces: {
    sign: "pisces",
    title: "Pisces",
    overview:
      "Pisces is imaginative, compassionate and spiritually tuned-in. You shine when intuition and creativity are allowed to flow.",
    strengths: ["Compassionate", "Artistic", "Intuitive"],
    challenges: ["Escapist", "Over-sensitive", "Indecisive"],
    compatibility: ["Cancer", "Scorpio", "Taurus"],
    luckyColor: "Sea Green",
    luckyDay: "Thursday",
    luckyNumbers: ["7", "16", "25"],
  },
};

const TAROT_LIBRARY_FALLBACK: TarotCard[] = [
  {
    name: "The Fool",
    meaning: "New beginnings, faith in the future and spontaneous movement.",
    keywords: ["fresh start", "trust", "leap"],
    arcana: "major",
  },
  {
    name: "The Magician",
    meaning: "Focused intention, skill and the ability to manifest.",
    keywords: ["willpower", "resourcefulness", "action"],
    arcana: "major",
  },
  {
    name: "The High Priestess",
    meaning: "Inner knowing, intuition and quiet wisdom.",
    keywords: ["intuition", "mystery", "reflection"],
    arcana: "major",
  },
  {
    name: "The Empress",
    meaning: "Creativity, abundance and nurturing energy.",
    keywords: ["growth", "beauty", "care"],
    arcana: "major",
  },
  {
    name: "The Emperor",
    meaning: "Structure, leadership and healthy boundaries.",
    keywords: ["authority", "discipline", "stability"],
    arcana: "major",
  },
  {
    name: "The Lovers",
    meaning: "Alignment in values, relationships and heartfelt choice.",
    keywords: ["union", "choice", "harmony"],
    arcana: "major",
  },
  {
    name: "The Chariot",
    meaning: "Momentum, determination and directed progress.",
    keywords: ["focus", "control", "victory"],
    arcana: "major",
  },
  {
    name: "Strength",
    meaning: "Gentle courage, resilience and heart-led confidence.",
    keywords: ["patience", "bravery", "compassion"],
    arcana: "major",
  },
  {
    name: "The Star",
    meaning: "Hope, healing and inspired direction.",
    keywords: ["renewal", "guidance", "optimism"],
    arcana: "major",
  },
  {
    name: "The Sun",
    meaning: "Joy, vitality and clear success.",
    keywords: ["clarity", "warmth", "celebration"],
    arcana: "major",
  },
];

function readString(source: JsonRecord, keys: string[]): string | null {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function readStringArray(source: JsonRecord, keys: string[]): string[] {
  for (const key of keys) {
    const value = source[key];

    if (Array.isArray(value)) {
      const normalized = value
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter(Boolean);

      if (normalized.length > 0) {
        return normalized;
      }
    }

    if (typeof value === "string" && value.includes(",")) {
      const parsed = value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);

      if (parsed.length > 0) {
        return parsed;
      }
    }
  }

  return [];
}

async function requestJson<T>(
  url: string,
  init: RequestInit = {},
  apiKey?: string,
): Promise<T> {
  const headers = new Headers(init.headers ?? {});
  headers.set("Accept", "application/json");

  if (init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (apiKey) {
    headers.set("x-api-key", apiKey);
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  const rawBody = await response.text();
  let parsedBody: unknown = null;

  if (rawBody) {
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      parsedBody = rawBody;
    }
  }

  if (!response.ok) {
    const message =
      typeof parsedBody === "object" && parsedBody
        ? readString(parsedBody as JsonRecord, ["message", "error", "detail"]) ||
          `Request failed with status ${response.status}`
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return parsedBody as T;
}

function normalizeSign(sign: string): ZodiacId | null {
  const normalized = sign.toLowerCase().trim();
  return normalized in zodiacSignsBySlug ? (normalized as ZodiacId) : null;
}

function personalizeHoroscopeText(
  baseText: string,
  context?: {
    fullName?: string;
    moonSign?: string;
    ascendantSign?: string;
  },
): string {
  if (!context) {
    return baseText;
  }

  const fragments: string[] = [];

  if (context.moonSign) {
    fragments.push(`Moon in ${context.moonSign}`);
  }

  if (context.ascendantSign) {
    fragments.push(`Ascendant in ${context.ascendantSign}`);
  }

  if (fragments.length === 0) {
    return baseText;
  }

  const personalizedLead = context.fullName
    ? `${context.fullName}, this is tuned with your chart placements.`
    : "This message is tuned with your chart placements.";

  return `${baseText}\n\n${personalizedLead} (${fragments.join(" • ")}).`;
}

function getFallbackDailyTarot(): DailyTarotInsight {
  const index = new Date().getDate() % TAROT_LIBRARY_FALLBACK.length;
  const card = TAROT_LIBRARY_FALLBACK[index];

  return {
    card,
    insight: `${card.name} asks you to focus on ${card.keywords?.[0] ?? "clarity"} today and make one intentional choice before the day ends.`,
  };
}

function parseTarotCard(record: JsonRecord): TarotCard | null {
  const name = readString(record, ["name", "card", "title"]);
  const meaning = readString(record, [
    "meaning",
    "description",
    "interpretation",
    "message",
  ]);

  if (!name || !meaning) {
    return null;
  }

  const keywords = readStringArray(record, ["keywords", "tags"]);
  const reversedMeaning = readString(record, ["reversedMeaning", "reversed"]);
  const arcanaCandidate = readString(record, ["arcana", "type"]);
  const arcana =
    arcanaCandidate === "major" || arcanaCandidate === "minor"
      ? arcanaCandidate
      : undefined;

  return {
    name,
    meaning,
    keywords,
    reversedMeaning: reversedMeaning || undefined,
    arcana,
  };
}

export async function fetchDailyHoroscope(
  sign: string,
  context?: {
    fullName?: string;
    moonSign?: string;
    ascendantSign?: string;
  },
): Promise<string> {
  const normalizedSign = normalizeSign(sign);

  if (!normalizedSign) {
    return "Add your birth details to receive a personalized daily horoscope.";
  }

  const fallback =
    "Today favors clear communication, kind boundaries and one brave next step. Trust your pace and protect your energy.";

  try {
    const data = await requestJson<JsonRecord>(
      `${HOROSCOPE_API_BASE_URL}/daily?sign=${normalizedSign}`,
      {},
      HOROSCOPE_API_KEY,
    );

    const message = readString(data, [
      "daily_horoscope",
      "horoscope",
      "prediction",
      "message",
      "reading",
    ]);

    return personalizeHoroscopeText(message || fallback, context);
  } catch {
    return personalizeHoroscopeText(fallback, context);
  }
}

export async function fetchZodiacOverview(sign: string): Promise<ZodiacOverview> {
  const normalizedSign = normalizeSign(sign);

  if (!normalizedSign) {
    throw new Error("Invalid zodiac sign.");
  }

  const fallback = ZODIAC_FALLBACKS[normalizedSign];

  try {
    const data = await requestJson<JsonRecord>(
      `${HOROSCOPE_API_BASE_URL}/zodiac/${normalizedSign}`,
      {},
      HOROSCOPE_API_KEY,
    );

    const strengths = readStringArray(data, ["strengths", "positive_traits", "pros"]);
    const challenges = readStringArray(data, ["challenges", "weaknesses", "cons"]);
    const compatibility = readStringArray(data, [
      "compatibility",
      "matches",
      "compatible_with",
    ]);
    const luckyNumbers = readStringArray(data, ["lucky_numbers", "luckyNumbers"]);

    return {
      sign: normalizedSign,
      title: readString(data, ["title", "name"]) || fallback.title,
      overview:
        readString(data, ["overview", "description", "about", "personality"]) ||
        fallback.overview,
      strengths: strengths.length > 0 ? strengths : fallback.strengths,
      challenges: challenges.length > 0 ? challenges : fallback.challenges,
      compatibility:
        compatibility.length > 0 ? compatibility : fallback.compatibility,
      luckyColor: readString(data, ["lucky_color", "luckyColor"]) || fallback.luckyColor,
      luckyDay: readString(data, ["lucky_day", "luckyDay"]) || fallback.luckyDay,
      luckyNumbers: luckyNumbers.length > 0 ? luckyNumbers : fallback.luckyNumbers,
    };
  } catch {
    return fallback;
  }
}

export async function fetchDailyTarotInsight(): Promise<DailyTarotInsight> {
  try {
    const data = await requestJson<unknown>(
      `${HOROSCOPE_API_BASE_URL}/tarot/cards/random`,
      {},
      HOROSCOPE_API_KEY,
    );

    if (Array.isArray(data) && data[0] && typeof data[0] === "object") {
      const parsedCard = parseTarotCard(data[0] as JsonRecord);
      if (parsedCard) {
        return {
          card: parsedCard,
          insight:
            readString(data[0] as JsonRecord, ["insight", "advice", "message"]) ||
            parsedCard.meaning,
        };
      }
    }

    if (typeof data === "object" && data) {
      const record = data as JsonRecord;
      const candidate =
        typeof record.card === "object" && record.card
          ? (record.card as JsonRecord)
          : record;
      const parsedCard = parseTarotCard(candidate);

      if (parsedCard) {
        return {
          card: parsedCard,
          insight:
            readString(record, ["insight", "advice", "message"]) ||
            parsedCard.meaning,
        };
      }
    }
  } catch {
    // Fallback handled below.
  }

  return getFallbackDailyTarot();
}

export async function fetchTarotCardsLibrary(): Promise<TarotCard[]> {
  try {
    const data = await requestJson<unknown>(
      `${HOROSCOPE_API_BASE_URL}/tarot/cards`,
      {},
      HOROSCOPE_API_KEY,
    );

    if (!Array.isArray(data)) {
      return TAROT_LIBRARY_FALLBACK;
    }

    const parsedCards = data
      .filter((entry): entry is JsonRecord => typeof entry === "object" && !!entry)
      .map((entry) => parseTarotCard(entry))
      .filter((entry): entry is TarotCard => entry !== null);

    return parsedCards.length > 0 ? parsedCards : TAROT_LIBRARY_FALLBACK;
  } catch {
    return TAROT_LIBRARY_FALLBACK;
  }
}

export async function fetchBirthChartSummary(
  details: BirthDetails,
): Promise<BirthChartSummary | null> {
  if (!details.birthDate || !details.birthPlace || !details.birthTime) {
    return null;
  }

  try {
    const data = await requestJson<JsonRecord>(
      `${ASTRO_API_BASE_URL}/birth-chart`,
      {
        method: "POST",
        body: JSON.stringify({
          birthDate: details.birthDate,
          birthTime: details.birthTime,
          birthPlace: details.birthPlace,
          birthCountryCode: details.birthCountryCode,
          birthTimezone: details.birthTimezone,
        }),
      },
      ASTRO_API_KEY,
    );

    const moonSign = readString(data, ["moonSign", "moon_sign", "moon"]);
    const ascendantSign = readString(data, [
      "ascendantSign",
      "ascendant_sign",
      "risingSign",
      "rising_sign",
    ]);

    if (!moonSign || !ascendantSign) {
      return null;
    }

    return {
      moonSign,
      ascendantSign,
      summary: readString(data, ["summary", "interpretation", "message"]) || undefined,
    };
  } catch {
    return null;
  }
}
