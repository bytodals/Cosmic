import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { fetchBirthChartSummary } from "@/lib/api";
import StarField from "@/components/effects/StarField";
import ZodiacCard from "@/components/zodiac/ZodiacCard";
import BirthDetailsModal from "@/components/modals/BirthDetailsModal";
import { zodiacSigns } from "@/data/Zodiacs";
import { useDailyTarot } from "@/hooks/useDailyTarot";
import { Button } from "@/components/ui/Button";
import { saveBirthDetails, getBirthDetails, BirthDetails, clearBirthDetails, hasCompletedBirthDetails } from "@/lib/birthDetailsStorage";
import { colors } from "@/constants/theme";

/**
 * Home screen -  root 
 */

export default function IndexScreen() {
  const { card, loading, error } = useDailyTarot();

  const [birthModalVisible, setBirthModalVisible] = useState(false);
  const [birthDetails, setBirthDetails] = useState<BirthDetails | null>(null);
  // chart summary (fetched from local sample when API disabled)
  const [chart, setChart] = useState<{ moonSign?: string; ascendantSign?: string; summary?: string } | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const stored = await getBirthDetails();
        if (mounted) setBirthDetails(stored);
      } catch (err) {
        console.error("Failed to load birth details:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // When birth details change, attempt to load the birth chart summary.
  useEffect(() => {
    let mounted = true;

    if (!hasCompletedBirthDetails(birthDetails)) {
      setChart(null);
      setChartError(null);
      setChartLoading(false);
      return;
    }

    const load = async () => {
      setChartLoading(true);
      setChartError(null);
      try {
        const summary = await fetchBirthChartSummary({
          birthDate: birthDetails!.birthDate,
          birthTime: birthDetails!.birthTime,
          birthPlace: birthDetails!.birthPlace,
          birthCountryCode: birthDetails!.birthCountryCode,
        });
        if (mounted) setChart(summary as any);
      } catch (err) {
        if (mounted) setChartError(err instanceof Error ? err.message : String(err));
      } finally {
        if (mounted) setChartLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [birthDetails]);

  // Birth chart fetching is intentionally disabled by default. If you enable
  // it via `ENABLE_BIRTH_API` in the API helper, we can re-enable fetching here.

  return (
    <View className="flex-1 bg-background">
      <StarField />

      <View className="flex-1">
        <ScrollView className="flex-1 px-5 py-6">

          {/* Header */}
          <View className="mb-8 mt-3 items-center">
            <Text className="text-4xl mt-10 font-display text-primary tracking-wider">
              Cosmic
            </Text>
            <Text className="mt-2 text-lg text-text-muted text-center">
              guidance from stars & cards
            </Text>
          </View>

         {/* Tarot */}
          <View className="mb-3">
            <Link href="/tarot" asChild>
            <Pressable className="rounded-2xl border border-primary/30 bg-card/60 p-4">
              <Text className="text-lg font-display text-primary mb-1">
                Today's Tarot
              </Text>

            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
              ) : error ? (
                <Text className="text-red-400 text-center">{error}</Text>
              ) : card ? (
            <>
                <Text className="text-md text-foreground font-light">{card.name}</Text>
              <Text className="mt-3 mb-3 text-text-muted">
              {card.meaning_up.substring(0, 120)}...
              </Text>
            </>
          ) : (
          <Text className="text-text-muted text-center">
            No card available today
          </Text>
        )}

          {/* Read more button */}
            <Button size="md" style={{ backgroundColor: 'transparent' }}>
              <Text style={{ color: colors.primary }}>Read more</Text>
            </Button>
          </Pressable>
        </Link>
      </View>

          {/* Personalization */}
          <View className="mb-6">
            {hasCompletedBirthDetails(birthDetails) ? (
              <Link href="/daily" asChild>
                <Pressable className="rounded-2xl border border-primary/30 bg-card/60 p-4 mb-3">
                  <Text className="text-lg font-display text-primary mb-2">Your Birth Chart</Text>

                  {chartLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : chart ? (
                    <>
                      <View className="flex-row justify-between">
                        <Text className="text-text">Moon sign:</Text>
                        <Text className="text-primary font-light">{chart.moonSign}</Text>
                      </View>
                      <View className="flex-row justify-between mt-2">
                        <Text className="text-text">Rising sign:</Text>
                        <Text className="text-primary font-light">{chart.ascendantSign}</Text>
                      </View>
                      {chart.summary && (
                        <Text className="text-text-muted font-light mt-2">{chart.summary}</Text>
                      )}
                    </>
                  ) : chartError ? (
                    <Text className="text-red-400">{chartError}</Text>
                  ) : (
                    <Text className="text-text-muted">Birth chart not loaded yet</Text>
                  )}
                </Pressable>
              </Link>
            ) : (
              <>
                <Pressable onPress={() => setBirthModalVisible(true)} className="mb-3">
                  <Text className="text-lg font-display text-foreground">
                    Personalize your horoscope
                  </Text>
                  <Text className="text-text-muted">
                    Add your birth details to personalize your horoscope
                  </Text>
                </Pressable>

                <Button onPress={() => setBirthModalVisible(true)}>Add details</Button>
              </>
            )}
          </View>

          {/* Zodiac list */}
          <Text className="mb-4 text-2xl font-display text-foreground">
            Explore Zodiac Signs
          </Text>

          <View className="flex-row flex-wrap -mx-2 pb-10">
            {zodiacSigns.map((sign) => (
            <View key={sign.slug} className="w-1/2 px-2 mb-4">
            <ZodiacCard sign={sign} />
            </View>
          ))}
          </View>


          {/* Modal */}
          <BirthDetailsModal
            visible={birthModalVisible}
            onClose={() => setBirthModalVisible(false)}
            initialDetails={birthDetails}
            onSave={async (details) => {
              await saveBirthDetails(details);
              setBirthDetails(details);
              setBirthModalVisible(false);
            }}
            onClear={async () => {
              await clearBirthDetails();
              setBirthDetails(null);
            }}
          />

        </ScrollView>
      </View>
    </View>
  );
}
