// detail screen for each zodiac sign - loading/error/empty states,reuses the existing custom hook


import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { colors } from "@/constants/theme";
import { useLocalSearchParams, Stack } from "expo-router";
import { useDailyHoroscope } from "@/hooks/useDailyHoroscope";
import { zodiacSigns } from "@/data/Zodiacs";
import type { ZodiacSign } from "@/data/Zodiacs";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";

export default function ZodiacDetailScreen() {
  // get zodiac ID from route params
  const { id } = useLocalSearchParams<{ id: string }>();
  // find zodiac based on the ID
  const sign: ZodiacSign | undefined = zodiacSigns.find((s) => s.id === id);
  // fetch todays horoscope for sign - custom hook
  const { data, loading, error, refetch } = useDailyHoroscope(sign?.id ?? "");

  // if sign is not found (invalid ID)
  if (!sign) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-5">
        <Text className="text-foreground text-xl font-medium">
          Zodiac sign not found.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* screen title and back button label */}
      <Stack.Screen 
        options={{ 
          title: sign.name,
          headerBackTitle: "Zodiac",
        }} 
      />

      <ScrollView className="flex-1 px-5 py-6">
        {/* zodiac sign details */}
        <Card className="items-center p-8 mb-8 mt-10">
          <Text
            className="text-7xl mb-4"
            style={{ color: colors.secondary, textShadowColor: colors.primaryGlow, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 18 }}
          >
            {sign.emoji}
          </Text>
          <Text className="text-3xl font-display text-primary mb-1">
            {sign.name}
          </Text>
          <Text className="text-sm text-text-muted">{sign.dates}</Text>

          <View className="mt-10 w-full">
            {/* loading indicator while fetching */}
            {loading ? (
              <View className="items-center py-10">
                <ActivityIndicator size="large" color="#primary" />
                <Text className="text-text-muted mt-4 text-center">
                  Loading today's horoscope...
                </Text>
              </View>
            ) : error ? (
              // error message if fail
              <Text className="text-red-400 text-center text-base">
                Error: {error}
              </Text>
            ) : data?.horoscope && data.horoscope.trim().length > 20 ? (
              // show horoscope if available
              <Text className="text-text leading-relaxed text-lg">
                {data.horoscope}
              </Text>
            ) : (
              // empty state if no horoscope is available
              <Text className="text-text-muted text-center">
                No horoscope available today.
              </Text>
            )}
          </View>
        </Card>

        {/* refetch horoscope */}
        <Button 
          onPress={refetch} 
          variant="outline"
        >
          ↻
        </Button>
      </ScrollView>
    </View>
  );
}
