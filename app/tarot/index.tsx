import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import StarField from "@/components/effects/StarField";
import { useDailyTarot } from "@/hooks/useDailyTarot";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "expo-router";
import { colors } from "@/constants/theme";

export default function TarotScreen() {
  const { card, loading, error } = useDailyTarot();

  return (
    <View className="flex-1 bg-background">
      <StarField />
      <ScrollView className="flex-1 px-5 py-6">
        <Text className="text-3xl font-display text-foreground mb-4">Tarot</Text>

        <Card className="mb-6">
          <Text className="text-xl font-display text-foreground mb-3">Today's Card</Text>

          {loading ? (
            <View className="items-center py-6">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : error ? (
            <Text className="text-red-400">{error}</Text>
          ) : card ? (
            <>
              <Text className="text-lg font-medium text-foreground">{card.name}</Text>
              <Text className="mt-2 text-text-muted">{card.meaning_up.substring(0, 220)}...</Text>
            </>
          ) : (
            <Text className="text-text-muted">No tarot card available today.</Text>
          )}

          <View className="mt-4">
            <Link href="/tarot/about-tarot" asChild>
              <Button size="md">Explore all cards</Button>
            </Link>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
