import { useState, useEffect, useCallback } from "react";
import { HoroscopeResponse } from "../lib/types";
import { ZodiacId } from "@/data/Zodiacs";


type Period = 'daily' | 'weekly' | 'monthly';

export function useHoroscope(sign: ZodiacId, period: Period = 'daily') {
  const [data, setData] = useState<HoroscopeResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHoroscope = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://freehoroscopeapi.com/api/v1/get-horoscope/${period}?sign=${sign}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: HoroscopeResponse = await res.json();
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load horoscope');
    } finally {
      setLoading(false);
    }
  }, [sign, period]);

  useEffect(() => {
    fetchHoroscope();
  }, [fetchHoroscope]);

  return { data, loading, error, refetch: fetchHoroscope };
}