// keep network logic separate from UI and hooks 
// Birth chart summary (moon + ascendant)

const BASE_URL = 'https://freehoroscopeapi.com/api/v1'; // or your own backend

/**
 * Fetches moon sign, ascendant and a short summary based on birth details.
 * Used in app/daily.tsx to personalize the chart.
 */
export async function fetchBirthChartSummary(details: {
  birthDate: string;
  birthTime?: string;
  birthPlace: string;
  birthCountryCode?: string;
}) {
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

    if (!response.ok) {
      throw new Error(`Birth chart API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      moonSign: data.moonSign || 'Unknown',
      ascendantSign: data.ascendantSign || 'Unknown',
      summary: data.summary || undefined,
    };
  } catch (error) {
    console.error('Failed to fetch birth chart:', error);
    // return fallback 
    return {
      moonSign: 'Moon sign unavailable',
      ascendantSign: 'Ascendant unavailable',
      summary: undefined,
    };
  }
}