// Custom hook for daily horoscope.

import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchDailyHoroscope } from "@/lib/api/horoscope";
import type { HoroscopeResponse } from "@/lib/types";

export interface DailyHoroscope {
  mood: any;
  date: string;
  period?: 'daily' | 'weekly' | 'monthly';
  sign?: string;
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

    if (!sign) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      // Check cache first
      const cacheKey = `${CACHE_PREFIX}${sign.toLowerCase()}`;
      const cached = await AsyncStorage.getItem(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        // Respect cache TTL but ignore cached entries lacking a usable horoscope text
        if (Date.now() - parsed.timestamp < CACHE_HOURS * 60 * 60 * 1000) {
          const cachedHoroscope = parsed.data?.horoscope;
          if (cachedHoroscope && String(cachedHoroscope).trim().length > 0) {
            setData(parsed.data);
            setLoading(false);
            return;
          }
          // otherwise fall through to fetch fresh data
        }
      }

      // Use the shared API helper which validates the response format
      const json = await fetchDailyHoroscope(sign as any);

      const freshData: DailyHoroscope = {
        date: json.date || new Date().toISOString().split('T')[0],
        period: json.period,
        sign: json.sign,
        horoscope: (json.horoscope || 'No horoscope available today.').toString(),
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