// app/index.tsx
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';


import StarField from '@/components/effects/StarField';
import ZodiacCard from '@/components/zodiac/ZodiacCard';
import { zodiacSigns } from '@/data/Zodiacs';
import { useDailyTarot } from '@/hooks/useDailyTarot'; // Custom hook for today's tarot card (VG level)
import { Button } from '@/components/ui/Button';

/**
 * Home screen (root route "/")
 * welcome message, today's tarot teaser, and list of zodiac signs
 */

export default function IndexScreen() {
  // Fetch today's tarot card using custom hook
  const { card, loading, error } = useDailyTarot();

  return (
    <View className="flex-1 bg-background">
      {/* Animated star field background  */}
      <StarField />

      <View className="flex-1">
        <ScrollView className="flex-1 px-5 py-6">
          {/* Hero / Welcome section */}
          <View className="mb-8 items-center">
            <Text className="text-4xl font-display text-foreground tracking-wider">
              Cosmic 
            </Text>
            <Text className="mt-2 text-lg text-text-muted text-center">
              guidance from the stars and the cards
            </Text>
          </View>

          {/* todays tarot preview */}
          <View className="mb-10 rounded-2xl border border-primary/30 bg-card/60 p-6">
            <Text className="text-2xl font-display text-primary mb-4">
              Today's Tarot
            </Text>

            {loading ? (
              <View className="items-center py-4">
                <ActivityIndicator size="large" color="#B87D56" />
              </View>
            ) : error ? (
              <Text className="text-red-400 text-center">{error}</Text>
            ) : card ? (
              <>
                <Text className="text-xl text-foreground font-medium">
                  {card.name}
                </Text>
                <Text className="mt-2 text-text-muted">
                  {card.meaning_up.substring(0, 120)}...
                </Text>

                {/* Link to full tarot info screen */}
                <Link href="/tarot" asChild>
                  <Button size="md" onPress={() => {}}>
                    Read more about today's card
                  </Button>
                </Link>
              </>
            ) : (
              <Text className="text-text-muted text-center">
                No card available today
              </Text>
            )}
          </View>

          {/* Zodiac Signs List */}
          <Text className="mb-4 text-2xl font-display text-foreground">
            Choose your sign
          </Text>

          <View className="gap-4 pb-10">
            {zodiacSigns.map((sign, index) => (
              <ZodiacCard
                key={sign.slug}
                sign={sign}
                index={index}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

