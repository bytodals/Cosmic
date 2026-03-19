// Dynamic route for a single zodiac sign.
// Shows today's horoscope + birth chart info.

import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { useDailyHoroscope } from '@/hooks/useDailyHoroscope';
import { Card } from '@/components/ui/Card';
import StarField from '@/components/effects/StarField';
import { Text, View } from 'react-native';
// ... other imports

export default function HoroscopeScreen() {
  const { sign } = useLocalSearchParams<{ sign: string }>();
  const horoscopeResult = useDailyHoroscope(sign!);

  return (
    <ScrollView className="flex-1 bg-background">
      <StarField />
      {/* Header with sign name + icon */}
      {/* Loading / Error / Content states using Card + Skeleton */}
      <Card>
        {horoscopeResult.loading && <Text>Loading...</Text>}
        {horoscopeResult.error && <Text>Error: {horoscopeResult.error}</Text>}
        {horoscopeResult.data && (
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Today's Horoscope</Text>
            <Text>{horoscopeResult.data.horoscope}</Text>
          </View>
        )}
      </Card>
    </ScrollView>
  );
}