//network logic separate from UI and hooks 
// Birth chart summary (moon + ascendant)

import sampleBirthChart from "@/data/sampleBirthChart.json";

const BASE_URL = 'https://freehoroscopeapi.com/api/v1'; 

// sample JSON so the UI can still render data
export const ENABLE_BIRTH_API = false;

/**
 * Fetches moon sign, ascendant and a short summary 
 */
export async function fetchBirthChartSummary(details: {
  birthDate: string;
  birthTime?: string;
  birthPlace: string;
  birthCountryCode?: string;
}) {

  if (!ENABLE_BIRTH_API) {
    // Return example data from the local JSON file
    return {
      moonSign: (sampleBirthChart as any)?.moonSign ?? 'Moon sign unavailable',
      ascendantSign: (sampleBirthChart as any)?.ascendantSign ?? 'Ascendant unavailable',
      summary: (sampleBirthChart as any)?.summary ?? undefined,
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/birth-chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: details.birthDate,
        time: details.birthTime || '12:00',
        city: details.birthPlace,
        countryCode: details.birthCountryCode || 'SE',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        moonSign: data.moonSign ?? 'Unknown',
        ascendantSign: data.ascendantSign ?? 'Unknown',
        summary: data.summary ?? undefined,
      };
    }

    // attempt to surface logs 
    let bodyText: string | null = null;
    try {
      bodyText = await response.text();
    } catch (e) {
      /* ignore */
    }
    console.warn(`Birth chart API returned ${response.status}${bodyText ? ` - ${bodyText}` : ''}`);

    return {
      moonSign: 'Moon sign unavailable',
      ascendantSign: 'Ascendant unavailable',
      summary: undefined,
    };
  } catch (error) {
    console.error('Failed to fetch birth chart:', error);
    // return  fallback 
    return {
      moonSign: 'Moon sign unavailable',
      ascendantSign: 'Ascendant unavailable',
      summary: undefined,
    };
  }
}