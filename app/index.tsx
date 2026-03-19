import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { fetchBirthChartSummary } from "@/lib/api";

import StarField from "@/components/effects/StarField";
import ZodiacCard from "@/components/zodiac/ZodiacCard";
import ZodiacDetailsModal from "@/components/zodiac/ZodiacDetailsModal";
import BirthDetailsModal from "@/components/modals/BirthDetailsModal";
import { zodiacSigns } from "@/data/Zodiacs";
import { useDailyTarot } from "@/hooks/useDailyTarot";
import { Button } from "@/components/ui/Button";
import { saveBirthDetails, getBirthDetails, hasCompletedBirthDetails, BirthDetails, clearBirthDetails } from "@/lib/birthDetailsStorage";
import { colors } from "@/constants/theme";

/**
 * Home screen (root route "/")
 * welcome message, today's tarot teaser, and list of zodiac signs
 */

export default function IndexScreen() {
  // Fetch today's tarot card using custom hook
  const { card, loading, error } = useDailyTarot();
  const [selectedSign, setSelectedSign] = useState(null as any);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [birthModalVisible, setBirthModalVisible] = useState(false);
  const [birthDetails, setBirthDetails] = useState<BirthDetails | null>(null);
  const [chart, setChart] = useState<{ moonSign?: string; ascendantSign?: string; summary?: string } | null>(null);
  const [chartLoading, setChartLoading] = useState(false);

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

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!birthDetails) {
        setChart(null);
        return;
      }

      setChartLoading(true);
      try {
        const summary = await fetchBirthChartSummary({
          birthDate: birthDetails.birthDate,
          birthTime: birthDetails.birthTime,
          birthPlace: birthDetails.birthPlace,
          birthCountryCode: birthDetails.birthCountryCode,
        });
        if (mounted) setChart(summary as any);
      } catch (err) {
        console.error("Failed to fetch birth chart summary:", err);
      } finally {
        if (mounted) setChartLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [birthDetails]);

  return (
    <View className="flex-1 bg-background">
      {/* Animated star field background  */}
      <StarField />

      <View className="flex-1">
        <ScrollView className="flex-1 px-5 py-6">
          {/* Hero / Welcome section */}
          <View className="mb-8 mt-3 items-center">
            <Text className="text-4xl mt-10 font-display text-foreground tracking-wider">
              Cosmic 
            </Text>
            <Text className="mt-2 text-lg text-text-muted text-center">
              guidance from stars & cards
            </Text>
          </View>

          {/* Top row: Today's Tarot and optional profile box */}
          {hasCompletedBirthDetails(birthDetails) ? (
            <View className="flex-row mb-6 -mx-2">
              <View className="w-1/2 px-2">
                <View className="rounded-2xl border border-primary/30 bg-card/60 p-6">
                  <Text className="text-xl font-display text-primary mb-2">Today's Tarot</Text>
                  {loading ? (
                    <View className="items-center py-4">
                      <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                  ) : error ? (
                    <Text className="text-red-400 text-center">{error}</Text>
                  ) : card ? (
                    <>
                      <Text className="text-xl text-foreground font-medium">{card.name}</Text>
                      <Text className="mt-2 mb-5 text-text-muted">{card.meaning_up.substring(0, 120)}...</Text>
                      <Link href="/tarot" asChild>
                        <Button size="md"><Text style={{ color: colors.background }}>Read more about today's card</Text></Button>
                      </Link>
                    </>
                  ) : (
                    <Text className="text-text-muted text-center">No card available today</Text>
                  )}
                </View>
              </View>

              <View className="w-1/2 px-2">
                <View className="rounded-2xl border border-border bg-card/70 p-6">
                  <Text className="text-xl font-display text-primary mb-2">Your Details</Text>
                  <Text className="text-text mb-2">{birthDetails?.fullName || 'Profile'}</Text>
                  {/* Sun name & element */}
                  {(() => {
                    const sunName = birthDetails?.zodiacSign
                      ? birthDetails.zodiacSign.charAt(0).toUpperCase() + birthDetails.zodiacSign.slice(1)
                      : '—';
                    const sunElement = birthDetails?.zodiacSign
                      ? zodiacSigns.find((s) => s.slug === birthDetails.zodiacSign)?.element
                      : undefined;

                    return (
                      <>
                        <Text className="text-text-muted">Sun: {sunName}</Text>
                        <Text className="text-text-muted">Element: {sunElement || '—'}</Text>
                      </>
                    );
                  })()}

                  {/* Moon & Rising (fetched summary) */}
                  {chartLoading ? (
                    <View className="mt-3">
                      <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                  ) : chart ? (
                    <>
                      <Text className="mt-3 text-text-muted">Moon: {chart.moonSign || '—'}</Text>
                      <Text className="text-text-muted">Rising: {chart.ascendantSign || '—'}</Text>
                      {chart.summary && <Text className="mt-2 text-text">{chart.summary}</Text>}
                    </>
                  ) : (
                    <Text className="mt-3 text-text-muted">Moon: —</Text>
                  )}

                  {/* Birth time/place */}
                  {birthDetails?.birthTime ? (
                    <Text className="mt-3 text-text-muted">Born at {birthDetails.birthTime}</Text>
                  ) : null}
                  {birthDetails?.birthPlace ? (
                    <Text className="text-text-muted">{birthDetails.birthPlace}</Text>
                  ) : null}

                  <View className="mt-4">
                    <Button variant="outline" style={{ width: '100%' }} onPress={() => setBirthModalVisible(true)}>Edit details</Button>
                    <View className="mt-3">
                      <Link href="/daily" asChild>
                        <Button><Text style={{ color: colors.background }}>View chart</Text></Button>
                      </Link>
                    </View>
                    <View className="mt-3">
                      <Button variant="outline" onPress={async () => {
                        await clearBirthDetails();
                        setBirthDetails(null);
                      }}>Forget my data</Button>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View className="mb-6">
              <View className="rounded-2xl border border-primary/30 bg-card/60 p-6">
                <Text className="text-2xl font-display text-primary mb-4">Today's Tarot</Text>
                {loading ? (
                  <View className="items-center py-4">
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>
                ) : error ? (
                  <Text className="text-red-400 text-center">{error}</Text>
                ) : card ? (
                  <>
                    <Text className="text-xl text-foreground font-medium">{card.name}</Text>
                    <Text className="mt-2 mb-5 text-text-muted">{card.meaning_up.substring(0, 120)}...</Text>
                    <Link href="/tarot" asChild>
                      <Button size="md"><Text style={{ color: colors.background }}>Read more about today's card</Text></Button>
                    </Link>
                  </>
                ) : (
                  <Text className="text-text-muted text-center">No card available today</Text>
                )}
              </View>
            </View>
          )}

          {/* Personalization prompt */}
          <View className="mb-6">
            <Text className="text-lg font-display text-foreground">Personalize your horoscope</Text>
            <Text className="text-text-muted mb-3">Add your birth details to personalize your horoscope</Text>
            <Button onPress={() => setBirthModalVisible(true)} variant="default">Personalize</Button>
          </View>

          {/* Zodiac Signs List */}
          <Text className="mb-4 text-2xl font-display text-foreground">
            Explore Zodiac Signs
          </Text>

          <View className="flex-row flex-wrap -mx-2 pb-10">
            {zodiacSigns.map((sign, index) => (
              <View key={sign.slug} className="w-1/2 px-2 mb-4">
                <ZodiacCard
                  sign={sign}
                  index={index}
                  size="sm"
                  onPress={() => {
                    setSelectedSign(sign);
                    setDetailsVisible(true);
                  }}
                />
              </View>
            ))}
          </View>

          <ZodiacDetailsModal
            visible={detailsVisible}
            sign={selectedSign}
             onClose={() => setDetailsVisible(false)}
          />

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

