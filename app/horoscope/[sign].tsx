// today's horoscope + birth chart info.

import { useLocalSearchParams } from "expo-router";
import { ScrollView, ActivityIndicator, Text, View } from "react-native";
import { useDailyHoroscope } from "@/hooks/useDailyHoroscope";
import { fontSizes } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import StarField from "@/components/effects/StarField";

export default function HoroscopeScreen() {
  const { sign } = useLocalSearchParams<{ sign: string }>();
  const { data, loading, error } = useDailyHoroscope(sign!);

  return (
    <ScrollView className="flex-1 bg-background">
      <StarField />
      <Card>
        {loading && (
          <View className="py-4">
            <ActivityIndicator size="large" />
          </View>
        )}

        {!loading && (
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: fontSizes.lg }}>Today's Horoscope</Text>
            {error ? (
              <Text>Error: {String(error)}</Text>
            ) : data ? (
              <Text className="mt-2">{data.horoscope}</Text>
            ) : (
              <Text className="mt-2">No horoscope available.</Text>
            )}
          </View>
        )}
      </Card>
    </ScrollView>
  );
}