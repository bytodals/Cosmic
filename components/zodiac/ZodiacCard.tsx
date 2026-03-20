import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/theme";
import { type ZodiacSign, elementColors } from "../../data/Zodiacs";

type ZodiacCardProps = {
  sign: ZodiacSign;
  size?: "sm" | "md";
  onPress?: () => void;
};

export default function ZodiacCard({ sign, size = "md", onPress }: ZodiacCardProps) {
  const elementColor = elementColors[sign.element];

  const styles = {
    container: size === "sm" ? "p-4" : "p-5",
    emoji: size === "sm" ? "text-3xl mb-2" : "text-4xl mb-3",
    name: size === "sm" ? "text-base" : "text-lg",
    dates: size === "sm" ? "text-2xs" : "text-xs",
  };

  const content = (
    <View className={`rounded-2xl border border-border bg-card/70 ${styles.container} items-center`}>
      <Text
        className={styles.emoji}
        style={{
          color: colors.secondary,
          textShadowColor: colors.primaryGlow,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 18,
        }}
      >
        {sign.emoji}
      </Text>
      <Text className={`${styles.name} font-display text-foreground`}>
        {sign.name}
      </Text>
      <Text className={`${styles.dates} text-text-muted mt-1`}>
        {sign.dates}
      </Text>
      <Text className="text-xs font-medium mt-2" style={{ color: elementColor }}>
        {sign.element}
      </Text>
    </View>
  );

  // If custom onPress is passed → use it
  if (onPress) {
    return (
      <Pressable onPress={onPress} className="active:opacity-75">
        {content}
      </Pressable>
    );
  }

  // Default → navigate to zodiac details page
  return (
    <Link href={`/zodiac/${sign.id}`} asChild>
      <Pressable className="active:opacity-75">
        {content}
      </Pressable>
    </Link>
  );
}
