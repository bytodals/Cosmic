// Clickable card for each zodiac sign.
// Uses dynamic routing with expo-router (VG requirement).

import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { type ZodiacSign, elementColors } from '../../constants/zodiac';


type ZodiacCardProps = {
  sign: ZodiacSign;
  index: number;
};

export default function ZodiacCard({ sign, index }: ZodiacCardProps) {
  return (
    <Link href={{ pathname: '/horoscope', params: { sign: sign.id } }} asChild>
      <Pressable className="rounded-2xl border border-border bg-card/70 p-5 active:opacity-75">
        <View className="flex-row items-center gap-4">

          <View className="flex-1">
            <Text className="text-xl font-display text-foreground">{sign.name}</Text>
            <Text className="text-sm text-textMuted">{sign.dates}</Text>
            <Text className={`text-xs font-medium mt-1 ${elementColors[sign.element]}`}>
              {sign.element}
            </Text>
          </View>

          <Text className="sr-only">Zodiac card {index + 1}</Text>
        </View>
      </Pressable>
    </Link>
  );
}