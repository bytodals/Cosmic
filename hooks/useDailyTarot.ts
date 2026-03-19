import { useState, useEffect, useCallback } from "react";
import { fetchRandomTarot } from "@/lib/api/tarot";
import { TarotCard } from "@/lib/types";

export function useDailyTarot() {
  const [card, setCard] = useState<TarotCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [drawn] = await fetchRandomTarot(1);
      setCard(drawn);
    } catch (err) {
      setError((err as Error).message || 'Failed to load today\'s tarot card');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  return { card, loading, error };
}