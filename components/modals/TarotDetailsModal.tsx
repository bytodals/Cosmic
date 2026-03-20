import { Modal, View, Text, TouchableWithoutFeedback, Platform } from "react-native";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import type { TarotCard } from "@/lib/types";
import { useState, useEffect } from "react";

type Props = {
  visible: boolean;
  cards: TarotCard[];
  startIndex?: number;
  onClose: () => void;
};

export default function TarotDetailsModal({ visible, cards, startIndex = 0, onClose }: Props) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (visible) setIndex(startIndex);
  }, [visible, startIndex]);

  const card = cards?.[index] ?? null;

  if (!cards || cards.length === 0) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          className="flex-1 items-center justify-center px-5"
          style={
            (Platform.OS === 'web'
              ? ({ backgroundColor: 'rgba(0 0 0 / 0.83)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' } as any)
              : { backgroundColor: 'rgba(0 0 0 / 0.93)' })
          }
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="w-full max-w-md">
              {/* Top-right close button */}
              <View style={{ position: 'absolute', top: 8, right: 8, zIndex: 40 }}>
                <Button variant="outline" onPress={onClose} style={{ paddingVertical: 6, paddingHorizontal: 8 }}>✖</Button>
              </View>

              <Card>
                <View>
                  <Text className="text-2xl font-display text-foreground mb-2">{card?.name}</Text>
                  <Text className="text-sm text-text-muted mb-3">{card?.type}{card?.suit ? ` • ${card.suit}` : ''}</Text>

                  <View>
                    <Text className="text-text mb-2">{card?.meaning_up}</Text>
                    {card?.meaning_rev && (
                      <Text className="mt-3 text-text-muted">Reversed insight: {card.meaning_rev}</Text>
                    )}
                  </View>
                </View>

                <View className="mt-6 flex-row gap-5 justify-center">
                  <Button size="xl" onPress={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} style={{ flex: 1 }}>◀</Button>
                  <Button size="xl" onPress={() => setIndex((i) => Math.min(cards.length - 1, i + 1))} disabled={index >= cards.length - 1} style={{ flex: 1 }}>▶</Button>
                </View>
              </Card>
            
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
