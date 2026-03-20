import { useState, useMemo } from "react";
import { View, Text, TextInput, FlatList, ActivityIndicator, Pressable } from "react-native";

import StarField from "@/components/effects/StarField";
import { useAllTarotCards } from "@/hooks/useTarot";
import { spacing } from "@/constants/theme";
import { colors } from "@/constants/theme";
import { TarotCard } from "@/lib/types";
import TarotDetailsModal from "@/components/modals/TarotDetailsModal";
import { Button } from "@/components/ui/Button";

export default function AboutTarot() {
  const { cards: cardsArray, loading, error } = useAllTarotCards();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCards = useMemo(() => {
    if (!cardsArray) return [];
    if (!searchQuery.trim()) return cardsArray;

    const q = searchQuery.toLowerCase();
    return cardsArray.filter(
      (card: { name: string; meaning_up: string; meaning_rev: string; type: string; }) =>
        card.name.toLowerCase().includes(q) ||
        card.meaning_up.toLowerCase().includes(q) ||
        (card.meaning_rev && card.meaning_rev.toLowerCase().includes(q)) ||
        card.type.toLowerCase().includes(q)
    );
  }, [cardsArray, searchQuery]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalStartIndex, setModalStartIndex] = useState(0);

  const renderCardItem = ({ item, index }: { item: TarotCard; index: number }) => (
    <Pressable onPress={() => { setModalStartIndex(index); setModalVisible(true); }} className="mb-4 rounded-xl border border-border bg-card p-5">
      <Text className="text-xl font-display text-foreground">
        {item.name}
      </Text>
      <Text className="mt-1 text-xs uppercase text-text-muted">
        {item.type} {item.suit ? `(${item.suit})` : ''}
      </Text>
      <Text className="mt-3 text-text-muted">
        Upright: {item.meaning_up.substring(0, 100)}...
      </Text>
      {item.meaning_rev && (
        <Text className="mt-2 text-text-muted">
          Reversed: {item.meaning_rev.substring(0, 80)}...
        </Text>
      )}
    </Pressable>
  );

  return (
    <View className="flex-1 bg-background">
      <StarField />

      <View className="flex-1">
        <View className="px-5 py-6">
            <Text className="text-3xl font-display text-foreground mt-10 mb-2">
            Tarot – The Wisdom of the Cards
            {" "}
            <Text className="text-lg text-text-muted font-normal">
              – All 78 cards explained
            </Text>
            {" "}
            <Text className="text-lg text-text-muted font-normal">
              (Rider-Waite-Smith deck)
            </Text>
            </Text>
            <Text className="text-text-muted mb-6">
            Explore all 78 cards in the Rider-Waite-Smith tradition. Search by name, meaning, or arcana type.
            </Text>

          {/* Search*/}
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search cards or meaning..."
            placeholderTextColor={colors.mutedForeground}
            className="mb-6 rounded-xl border border-border bg-muted px-4 py-3 text-foreground"
          />

          {loading ? (
            <View className="items-center py-10">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="mt-4 text-text-muted">Loading tarot cards...</Text>
            </View>
          ) : error ? (
            <View className="items-center py-10">
              <Text className="text-red-400 text-center">{error}</Text>
              <Button style={{ marginTop: spacing.lg }} onPress={() => {/* refetch */}}>
                Try again
              </Button>
            </View>
          ) : filteredCards.length === 0 ? (
            <Text className="text-center text-text-muted py-10">
            No Cards matched your search "{searchQuery}"
            </Text>
          ) : (
            <FlatList
              data={filteredCards}
              renderItem={renderCardItem}
              keyExtractor={(item: { name_short: any; name: any; }) => item.name_short || item.name}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: spacing['3xl'] }}
            />
          )}
          <TarotDetailsModal visible={modalVisible} cards={filteredCards} startIndex={modalStartIndex} onClose={() => setModalVisible(false)} />
        </View>
      </View>
    </View>

    
  );
}