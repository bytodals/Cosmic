import { useState, useEffect, useCallback } from "react";
import { fetchAllTarotCards } from "@/lib/api/tarot";
import { TarotCard } from "@/lib/types";

export function useAllTarotCards() {
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allCards = await fetchAllTarotCards();
      // Sorting optional: major first,  minor after suit
      const sorted = allCards.sort((a, b) => {
        if (a.type === 'major' && b.type !== 'major') return -1;
        if (a.type !== 'major' && b.type === 'major') return 1;
        return 0;
      });
      setCards(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tarot cards");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  return { cards, loading, error, refetch: loadCards };
}