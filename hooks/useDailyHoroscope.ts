// Custom hook for daily horoscope.

import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchDailyHoroscope } from "@/lib/api/horoscope";
import { zodiacById } from "@/data/Zodiacs";

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
          const cachedHoroscope = String(parsed.data?.horoscope || '').trim();
          // ignore empty or placeholder values saved in older runs
          if (cachedHoroscope && !/no horoscope available/i.test(cachedHoroscope)) {
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
        horoscope: (json.horoscope || '').toString(),
        mood: undefined,
      };

      // If API returned an empty/placeholder horoscope, fall back to the
      // local static zodiac description so the user sees something useful.
      const raw = String(freshData.horoscope || '').trim();
      if (!raw || /no horoscope available/i.test(raw)) {
        const key = String(sign || '').toLowerCase();
        const local = (zodiacById as any)[key];
        if (local && local.description) {
          freshData.horoscope = local.description;
        } else {
          freshData.horoscope = 'No horoscope available today.';
        }
      }

      setData(freshData);

      // Save to cache only when we have a non-empty, non-placeholder horoscope
      const shouldCache = String(freshData.horoscope || '').trim().length > 0 &&
        !/no horoscope available/i.test(String(freshData.horoscope));

      if (shouldCache) {
        await AsyncStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data: freshData,
        }));
      }
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