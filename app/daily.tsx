import { useMemo, useState, useCallback } from "react";
import { Link, useFocusEffect } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { useDailyHoroscope } from "@/hooks/useDailyHoroscope";

import {
  BirthDetails,
  getBirthDetails,
  hasCompletedBirthDetails,
  inferZodiacSignFromBirthDate,
} from "@/lib/birthDetailsStorage";
import { fetchBirthChartSummary } from "@/lib/api";

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

  // Memoized zodiac sign calculation – avoids recalculating on every render
  const zodiacSign = useMemo(() => {
    return details ? inferZodiacSignFromBirthDate(details.birthDate) : null;
  }, [details]);

  // Custom hook for today's horoscope (good VG practice: logic extracted)
  const { data: horoscope, loading: horoscopeLoading, error: horoscopeError } =
    useDailyHoroscope(zodiacSign ?? "");

  // Reload profile & chart when screen comes into focus
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
        throw new Error("Incomplete birth chart data from API");
      }
      setChart(summary);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not fetch birth chart";
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
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#B87D56" />
        <Text className="mt-4 text-text-muted">Loading your profile...</Text>
      </View>
    );
  }

  // ────────────────────────────────────────────────
  // No birth details → onboarding prompt
  // ────────────────────────────────────────────────
  if (!details || !hasCompletedBirthDetails(details)) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6 py-12">
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
    );
  }

  // ────────────────────────────────────────────────
  // Main content – user has birth details
  // ────────────────────────────────────────────────
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-5 pt-8">

        {/* Today's Horoscope Section */}
        <Card className="mb-6">
          <Text className="text-xl font-semibold text-foreground mb-3">
            Today's Horoscope – {zodiacSign ? zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1) : "..."}
          </Text>

          {horoscopeLoading ? (
            <ActivityIndicator size="small" color="#B87D56" />
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
        <Card className="mb-6">
          <Text className="text-xl font-semibold text-foreground mb-3">
            Your Birth Chart Highlights
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
            </View>
          ) : (
            <Text className="text-text-muted">Birth chart not loaded yet</Text>
          )}
        </Card>

        {/* Quick actions */}
        <View className="flex-row gap-4 justify-center mt-4">
          <Link href="/tarot" asChild>
            <Button variant="outline" onPress={function (): void {
              throw new Error("Function not implemented.");
            } }>Today's Tarot</Button>
          </Link>
          <Link href="/profile" asChild>
            <Button variant="outline" onPress={function (): void {
              throw new Error("Function not implemented.");
            } }>Edit profile</Button>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}