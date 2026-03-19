// card for each zodiac sign.

import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import { type ZodiacSign, elementColors } from "../../data/Zodiacs";

type ZodiacCardProps = {
  sign: ZodiacSign;
  index: number;
  onPress?: () => void;
  size?: 'sm' | 'md';
};

export default function ZodiacCard(props: ZodiacCardProps) {
  const { sign, index, onPress, size } = props;
  // If onPress is provided, render a Pressable that calls it; otherwise use link to navigate.
  const elementColor = elementColors[sign.element];
  const cardSize = (sz: ZodiacCardProps['size']) => ({
    padding: sz === 'sm' ? 'p-4' : 'p-5',
    emoji: sz === 'sm' ? 'text-3xl mb-2' : 'text-4xl mb-3',
    name: sz === 'sm' ? 'text-base' : 'text-lg',
    dates: sz === 'sm' ? 'text-2xs' : 'text-xs',
  });

  const s = cardSize(size ?? 'md');

  const Inner = (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl border border-border bg-card/70 ${s.padding} active:opacity-95 items-center`}
    >
      <Text className={`${s.emoji}`}>{sign.emoji}</Text>
      <Text className={`${s.name} font-display text-foreground`}>{sign.name}</Text>
      <Text className={`${s.dates} text-text-muted mt-1`}>{sign.dates}</Text>
      <Text className={`text-xs font-medium mt-2`} style={{ color: elementColor }}>{sign.element}</Text>
      <Text className="sr-only">Zodiac card {index + 1}</Text>
    </Pressable>
  );

  if (onPress) return Inner;

  return (
    <Link href={{ pathname: '/horoscope', params: { sign: sign.id } }} asChild>
      {Inner}
    </Link>
  );
}
