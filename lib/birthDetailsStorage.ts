import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ZodiacId } from "@/types";

export interface BirthDetails {
	fullName: string;
	birthDate: string; // YYYY-MM-DD
	birthTime: string; // HH:mm (optional)
	birthPlace: string; // City
	birthCountryCode: string; // ex "SE", "US"
	birthTimezone: string; // ex "Europe/Stockholm"
	zodiacSign: ZodiacId | ""; 
}

export const STORAGE_KEY = "@Cosmic:birthDetails";
export const REMEMBER_ME_KEY = "@Cosmic:rememberBirthDetails";

let sessionBirthDetails: BirthDetails | null = null;

export const emptyBirthDetails: BirthDetails = {
	fullName: "",
	birthDate: "",
	birthTime: "",
	birthPlace: "",
	birthCountryCode: "",
	birthTimezone: "",
	zodiacSign: "",
};

export const DEFAULT_REMEMBER_ME = true;

function parseDateParts(dateStr: string): { month: number; day: number } | null {
	const parts = dateStr.split("-");
	if (parts.length !== 3) {
		return null;
	}

	const month = Number(parts[1]);
	const day = Number(parts[2]);

	if (!Number.isInteger(month) || !Number.isInteger(day)) {
		return null;
	}

	if (month < 1 || month > 12 || day < 1 || day > 31) {
		return null;
	}

	return { month, day };
}

/**
 * applies zodiac sign from birth date (YYYY-MM-DD)
 * Returns null if date is invalid or missing
 */
export function inferZodiacSignFromBirthDate(dateStr: string): ZodiacId | null {
	if (!dateStr) return null;

	const parsed = parseDateParts(dateStr);
	if (!parsed) {
		return null;
	}

	const { month, day } = parsed;

	if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries";
	if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus";
	if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini";
	if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer";
	if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo";
	if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo";
	if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra";
	if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
		return "scorpio";
	if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
		return "sagittarius";
	if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
		return "capricorn";
	if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
		return "aquarius";
	if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "pisces";

	return null;
}

export function hasCompletedBirthDetails(
	details: BirthDetails | null | undefined,
): details is BirthDetails {
	if (!details) {
		return false;
	}

	return Boolean(details.fullName.trim() && details.birthDate.trim());
}

function normalizeBirthDetails(
	rawDetails: Partial<BirthDetails>,
): BirthDetails {
	const merged: BirthDetails = {
		...emptyBirthDetails,
		...rawDetails,
	};

	return {
		...merged,
		zodiacSign:
			merged.zodiacSign || inferZodiacSignFromBirthDate(merged.birthDate) || "",
	};
}

/**
 * Keep birth details only for current app session (not persisted).
 */
export const setSessionBirthDetails = (
	details: BirthDetails | null | undefined,
): void => {
	sessionBirthDetails = details ? normalizeBirthDetails(details) : null;
};

/**
 * Clear only persisted birth details from device storage.
 * Session details remain untouched.
 */
export const clearSavedBirthDetails = async (): Promise<void> => {
	try {
		await AsyncStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.error("Failed to clear saved birth details:", error);
	}
};

/**
 * Save birth details to AsyncStorage
 */
export const saveBirthDetails = async (
	details: BirthDetails,
): Promise<void> => {
	try {
		const normalizedDetails = normalizeBirthDetails(details);
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedDetails));
		sessionBirthDetails = normalizedDetails;
	} catch (error) {
		console.error("Failed to save birth details:", error);
		throw new Error("Could not save your birth details. Please try again.");
	}
};

/**
 * Load birth details from AsyncStorage
 */
export const getBirthDetails = async (): Promise<BirthDetails | null> => {
	try {
		const json = await AsyncStorage.getItem(STORAGE_KEY);
		if (!json) {
			return sessionBirthDetails;
		}

		const parsed = JSON.parse(json) as Partial<BirthDetails>;
		const normalizedDetails = normalizeBirthDetails(parsed);
		sessionBirthDetails = normalizedDetails;
		return normalizedDetails;
	} catch (error) {
		console.error("Failed to load birth details:", error);
		return sessionBirthDetails;
	}
};

/**
 * Clear birth details (for testing or reset)
 */
export const clearBirthDetails = async (): Promise<void> => {
	await clearSavedBirthDetails();
	sessionBirthDetails = null;
};

/**
 * Save "remember me" preference for local birth details persistence
 */
export const setRememberBirthDetailsPreference = async (
	shouldRemember: boolean,
): Promise<void> => {
	try {
		await AsyncStorage.setItem(REMEMBER_ME_KEY, shouldRemember ? "1" : "0");
	} catch (error) {
		console.error("Failed to save remember preference:", error);
	}
};

/**
 * Load "remember me" preference
 * Defaults to true when preference has not been set yet.
 */
export const getRememberBirthDetailsPreference = async (): Promise<boolean> => {
	try {
		const value = await AsyncStorage.getItem(REMEMBER_ME_KEY);

		if (value === null) {
			return DEFAULT_REMEMBER_ME;
		}

		return value === "1";
	} catch (error) {
		console.error("Failed to load remember preference:", error);
		return DEFAULT_REMEMBER_ME;
	}
};
