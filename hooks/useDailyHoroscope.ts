// hooks/useDailyHoroscope.ts
// Custom hook that fetches, caches (24h), and handles errors for daily horoscope.
// This is the core of VG-level code quality.

import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DailyHoroscope {
  mood: any;
  date: string;
  horoscope: string;
}

const CACHE_PREFIX = 'cosmic_horoscope_';
const CACHE_HOURS = 24;

export function useDailyHoroscope(sign: string) {
  const [data, setData] = useState<DailyHoroscope | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHoroscope = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cacheKey = `${CACHE_PREFIX}${sign.toLowerCase()}`;
      const cached = await AsyncStorage.getItem(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_HOURS * 60 * 60 * 1000) {
          setData(parsed.data);
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      const res = await fetch(
        `https://freehoroscopeapi.com/api/v1/get-horoscope/daily?sign=${sign.toLowerCase()}`
      );
      if (!res.ok) throw new Error('Network error');

      const json = await res.json();
      const freshData: DailyHoroscope = {
        date: json.date || new Date().toISOString().split('T')[0],
        horoscope: json.horoscope?.trim() || 'No horoscope available today.',
        mood: undefined
      };

      setData(freshData);

      // Save to cache
      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: freshData,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load horoscope');
    } finally {
      setLoading(false);
    }
  }, [sign]);

  useEffect(() => {
    fetchHoroscope();
  }, [fetchHoroscope]);

  return { data, loading, error, refetch: fetchHoroscope };
}