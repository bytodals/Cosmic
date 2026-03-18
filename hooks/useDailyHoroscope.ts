import { useCallback, useEffect, useState } from "react";
import { fetchDailyHoroscope } from "@/lib/api";

type HoroscopeContext = {
  fullName?: string;
  moonSign?: string;
  ascendantSign?: string;
};

export function useDailyHoroscope(sign: string, context?: HoroscopeContext) {
  const [horoscope, setHoroscope] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!sign) {
      setHoroscope("");
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const value = await fetchDailyHoroscope(sign, context);
      setHoroscope(value);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Could not load horoscope right now.",
      );
    } finally {
      setLoading(false);
    }
  }, [context, sign]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    horoscope,
    loading,
    error,
    refresh,
  };
}
