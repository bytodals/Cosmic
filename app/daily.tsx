import { useMemo, useState, useCallback } from "react";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import StarField from "@/components/effects/StarField";
import { colors } from "@/constants/theme";
import { useDailyHoroscope } from "@/hooks/useDailyHoroscope";

import {
  BirthDetails,
  getBirthDetails,
  hasCompletedBirthDetails,
  inferZodiacSignFromBirthDate,
} from "@/lib/birthDetailsStorage";
import { clearBirthDetails } from "@/lib/birthDetailsStorage";
import { fetchBirthChartSummary } from "@/lib/api";
import { generatePersonalizedHoroscope } from "@/lib/api/zodiac";

// Type for the birth chart summary (can be extended later)
interface BirthChartSummary {
  moonSign: string;
  ascendantSign: string;
  summary?: string;
}

export default function DailyScreen() {
  const [details, setDetails] = useState<BirthDetails | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [chart, setChart] = useState<BirthChartSummary | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [personalizedHoroscope, setPersonalizedHoroscope] = useState<string | null>(null);
  const [personalizedLoading, setPersonalizedLoading] = useState(false);
  const [personalizedError, setPersonalizedError] = useState<string | null>(null);

  // zodiac sign calculation to avoid recalculating every render
  const zodiacSign = useMemo(() => {
    if (!details) return null;
    // prefer an explicit stored zodiac sign if available (saved by the form),
    // otherwise attempt to infer from the birth date
    return typeof details.zodiacSign === 'string' && details.zodiacSign.trim() !== ''
      ? (details.zodiacSign as any)
      : inferZodiacSignFromBirthDate(details.birthDate);
  }, [details]);

  const router = useRouter();

  const handleClearBirthDetails = async () => {
    setChart(null);
    setChartError(null);
    setPersonalizedHoroscope(null);
    setPersonalizedError(null);
    try {
      await clearBirthDetails();
    } catch (err) {
      console.error('Failed to clear birth details:', err);
    }
    setDetails(null);
    // navigate back to home/index where user can re-open the birth details modal
    router.push('/');
  };

  // hook for todays horoscope 
  const { data: horoscope, loading: horoscopeLoading, error: horoscopeError } =
    useDailyHoroscope(zodiacSign ?? "");

  // reload profile & chart when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadProfile = async () => {
        if (!isActive) return;

        setLoadingProfile(true);
        setChart(null); // reset chart when reloading profile
        setChartError(null);

        try {
          const storedDetails = await getBirthDetails();
          if (isActive) {
            setDetails(storedDetails);
            setLoadingProfile(false);

            // Only attempt to load chart if we have enough birth data
            if (hasCompletedBirthDetails(storedDetails)) {
              await loadChart(storedDetails);
            }
          }
        } catch (err) {
          console.error("Failed to load birth details:", err);
          if (isActive) {
            setLoadingProfile(false);
          }
        }
      };

      loadProfile();

      // Cleanup: prevent state updates after component unmount / blur
      return () => {
        isActive = false;
      };
    }, [])
  );

  // Load birth chart summary (extracted function = easier to test & reuse)
  const loadChart = async (birthDetails: BirthDetails) => {
    setChartLoading(true);
    setChartError(null);
    try {
      const summary = await fetchBirthChartSummary(birthDetails);
      // Basic runtime validation (VG robustness)
      if (!summary?.moonSign || !summary?.ascendantSign) {
        // Don't throw here; earlier API helper now returns graceful fallbacks.
        console.warn('Birth chart appears incomplete, but continuing with available data');
      }
      setChart(summary);

      // Generate personalized horoscope using available details (best-effort)
      try {
        setPersonalizedHoroscope(null);
        setPersonalizedError(null);
        setPersonalizedLoading(true);

        const signId = inferZodiacSignFromBirthDate(birthDetails.birthDate) || '';
        if (signId) {
          const txt = await generatePersonalizedHoroscope(signId, {
            fullName: birthDetails.fullName,
            birthDate: birthDetails.birthDate,
            birthTime: birthDetails.birthTime,
            birthPlace: birthDetails.birthPlace,
          });
          if (txt) setPersonalizedHoroscope(txt);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to generate personalized horoscope';
        setPersonalizedError(msg);
        console.error('Personalization error:', err);
      } finally {
        setPersonalizedLoading(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not fetch birth chart";
      setChartError(message);
      console.error("Chart fetch error:", err);
    } finally {
      setChartLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  // Loading state – full screen
  // ────────────────────────────────────────────────
  if (loadingProfile) {
    return (
      <View className="flex-1 bg-background">
        <StarField />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-4 text-text-muted">Loading your profile...</Text>
        </View>
      </View>
    );
  }

  // ────────────────────────────────────────────────
  // No birth details → onboarding prompt
  // ────────────────────────────────────────────────
  if (!details || !hasCompletedBirthDetails(details)) {
    return (
      <View className="flex-1 bg-background">
        <StarField />
        <View className="flex-1 items-center justify-center px-6 py-12">
          <Text className="text-2xl font-semibold text-foreground mb-4 text-center">
            Your cosmic journey starts here ✨
          </Text>
          <Text className="text-center text-text-muted mb-8 max-w-md">
            Add your birth details to get personalized daily horoscopes and a full birth chart (Moon & Rising signs).
          </Text>
          <Link href="/profile" asChild>
            <Button size="lg" onPress={function (): void {
              throw new Error("Function not implemented.");
            }}>Add birth details</Button>
          </Link>
        </View>
      </View>
    );
  }

  // ────────────────────────────────────────────────
  // Main content – user has birth details
  // ────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-background">
      <StarField />
      <ScrollView className="flex-1 px-5 pt-12 pb-6">
        <View>

        {/* Today's Horoscope Section */}
        <Card className="mb-5 mt-10">
          <Text className="text-xl font-normal text-primary mb-3">
            Today's Horoscope for {zodiacSign ? zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1) : "..."}
          </Text>

          {(horoscopeLoading || personalizedLoading) ? (
            <ActivityIndicator size="small" color="#B87D56" />
          ) : personalizedHoroscope ? (
            <Text className="text-text mb-2">{personalizedHoroscope}</Text>
          ) : personalizedError ? (
            <Text className="text-red-400">{personalizedError}</Text>
          ) : horoscopeError ? (
            <Text className="text-red-400">{horoscopeError}</Text>
          ) : horoscope ? (
            <>
              <Text className="text-text mb-2">{horoscope.horoscope}</Text>
              {horoscope.mood && (
                <Text className="text-sm text-text-muted italic">
                  Mood: {horoscope.mood}
                </Text>
              )}
            </>
          ) : (
            <Text className="text-text-muted">No horoscope available today</Text>
          )}
        </Card>

        {/* Birth Chart Summary */}
        <Card className="mb-5">
          <Text className="text-xl font-normal text-primary mb-3">
            Birth Chart Highlights
          </Text>

          {chartLoading ? (
            <ActivityIndicator size="small" color="#B87D56" />
          ) : chartError ? (
            <Text className="text-red-400">{chartError}</Text>
          ) : chart ? (
            <View className="gap-3">
              <View className="flex-row justify-between">
                <Text className="text-text">Moon sign:</Text>
                <Text className="text-primary font-medium">{chart.moonSign}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text">Rising sign:</Text>
                <Text className="text-primary font-medium">{chart.ascendantSign}</Text>
              </View>
              {chart.summary && (
                <Text className="text-text-muted mt-2">{chart.summary}</Text>
              )}
              <View className="mt-4 flex-row justify-end">
                <Button variant="outline" size="md" onPress={handleClearBirthDetails}>Clear details</Button>
              </View>
            </View>
          ) : (
            <Text className="text-text-muted">Birth chart not loaded yet</Text>
          )}
        </Card>


        </View>
      </ScrollView>
    </View>
  );
}