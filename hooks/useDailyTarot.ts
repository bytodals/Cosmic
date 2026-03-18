import { useCallback, useEffect, useState } from "react";
import { fetchDailyTarotInsight } from "@/lib/api";
import type { DailyTarotInsight } from "@/types";

export function useDailyTarot() {
  const [tarot, setTarot] = useState<DailyTarotInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const insight = await fetchDailyTarotInsight();
      setTarot(insight);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Could not load tarot insight right now.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    tarot,
    loading,
    error,
    refresh,
  };
}
