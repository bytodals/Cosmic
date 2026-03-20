import { View, Text, ActivityIndicator, ScrollView, Dimensions } from "react-native";
import StarField from "@/components/effects/StarField";
import { useDailyTarot } from "@/hooks/useDailyTarot";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "expo-router";
import { colors } from "@/constants/theme";

export default function TarotScreen() {
  const { card, loading, error } = useDailyTarot();
  const windowWidth = Dimensions.get("window").width;
  const glyphSize = Math.round(windowWidth * 0.6);

  return (
    <View className="flex-1 bg-background">
      <StarField />
      <ScrollView className="flex-1 mt-6 px-6 py-6">
        <Text className="text-3xl font-display text-primary mt-10 mb-4">Today's Card</Text>

        <Card className="mb-6">
          {loading ? (
            <View className="items-center py-6">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : error ? (
            <Text className="text-red-400">{error}</Text>
          ) : card ? (
            <>
              <Text className="text-lg font-medium text-foreground">{card.name}</Text>
              <Text className="mt-2 text-text-muted">{card.meaning_up}</Text>
            </>
          ) : (
            <Text className="text-text-muted">No tarot card available today.</Text>
          )}

          </Card>

      

          <View className="mt-4 items-center">
            <Link href="/tarot/about-tarot" asChild>
              <Button size="md">See all cards</Button>
            </Link>
          </View>

            {/*image under the card box */}
          <View className="items-center mb-1">
            <Text
              style={{
                color: colors.primary,
                textShadowColor: colors.primaryGlow,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 18,
                fontSize: glyphSize,
                lineHeight: glyphSize,
                opacity: 0.9,
              }}
            >
              {"🀙"}
            </Text>
          </View>
      </ScrollView>
    </View>
  );
}
