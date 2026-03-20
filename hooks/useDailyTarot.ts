import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchRandomTarot } from "@/lib/api/tarot";
import { TarotCard } from "@/lib/types";

const CACHE_PREFIX = 'cosmic_tarot_';
const CACHE_HOURS = 24;

function localDateKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function useDailyTarot() {
  const [card, setCard] = useState<TarotCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCard = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const dateKey = localDateKey();
      const cacheKey = `${CACHE_PREFIX}${dateKey}`;

      if (!forceRefresh) {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            const ts = parsed?.timestamp ?? 0;
            const data = parsed?.data ?? null;
            if (data && Date.now() - ts < CACHE_HOURS * 60 * 60 * 1000) {
              setCard(data as TarotCard);
              setLoading(false);
              return;
            }
          } catch (e) {
            // ignore parse errors and fall through to fetch fresh
          }
        }
      }

      const cards = await fetchRandomTarot(1);
      const drawn = cards && cards.length > 0 ? cards[0] : null;
      if (!drawn) {
        throw new Error('No tarot card returned from API');
      }

      setCard(drawn);

      try {
        await AsyncStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data: drawn,
        }));
      } catch (e) {
        // ignore storage errors
        console.warn('Failed to cache tarot card:', e);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load today\'s tarot card');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  return { card, loading, error, refetch: () => loadCard(true) };
}