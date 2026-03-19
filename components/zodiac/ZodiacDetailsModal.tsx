import { Modal, Text, View, ActivityIndicator, TouchableWithoutFeedback, Platform } from "react-native";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useDailyHoroscope } from "@/hooks/useDailyHoroscope";
import type { ZodiacSign } from "@/data/Zodiacs";
import { useEffect, useState } from "react";
import { fetchZodiacInfo, ZodiacInfo } from "@/lib/api/zodiac";

type Props = {
  visible: boolean;
  sign: ZodiacSign | null;
  onClose: () => void;
};

export default function ZodiacDetailsModal({ visible, sign, onClose }: Props) {
  // only call hook if sign is present component mounted only when visible
  const { data, loading, error: _error, refetch } = useDailyHoroscope(sign?.id ?? "");

  const [zodiacInfo, setZodiacInfo] = useState<ZodiacInfo | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!visible || !sign) return;

    setZodiacInfo(null);

    fetchZodiacInfo(sign.id).then((info) => {
      if (mounted) setZodiacInfo(info);
    });

    return () => {
      mounted = false;
    };
  }, [visible, sign?.id]);

  useEffect(() => {
    if (!visible || !sign) return;
    console.debug('[ZodiacDetailsModal] debug', { signId: sign.id, loading, data, zodiacInfo });
  }, [visible, sign?.id, loading, data, zodiacInfo]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          className="flex-1 items-center justify-center px-5"
          style={
            (Platform.OS === "web"
              ? ({ backgroundColor: "rgba(0 0 0 / 0.78)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" } as any)
              : { backgroundColor: "rgba(0 0 0 / 0.83)" })
          }
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="w-full max-w-md">
              <Card>
                <View className="items-center">
                  <Text className="text-5xl color-primary mb-3">{sign?.emoji}</Text>
                  <Text className="text-2xl font-display text-primary">{sign?.name}</Text>
                  <Text className="text-sm text-foreground">{sign?.dates}</Text>
                </View>

                <View className="mt-6">
                  {loading ? (
                    <View className="items-center py-6">
                      <ActivityIndicator size="large" color="primary" />
                    </View>
                  ) : (data && (data.horoscope || '').trim().length > 0) ? (
                    <Text className="text-text mt-2">{data.horoscope}</Text>
                  ) : zodiacInfo?.description ? (
                    <Text className="text-text mt-2">{zodiacInfo.description}</Text>
                  ) : (
                    <Text className="text-text-muted">No data available.</Text>
                  )}
                </View>

                <View className="mt-6 flex-row gap-3">
                  <Button variant="outline" onPress={onClose} style={{ flex: 1 }}>
                    Close
                  </Button>
                  <Button onPress={refetch} style={{ flex: 1 }}>
                    Refresh
                  </Button>
                </View>
              </Card>

              {/* Back button below the card (separate from card actions) */}
              <View className="mt-4">
                <Button variant="outline" onPress={onClose}>
                  Back
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
