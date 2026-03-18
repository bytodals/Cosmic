import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import Button from "@/components/ui/button";
import { useDailyTarot } from "@/hooks/useDailyTarot";

export default function Tarot() {
	const { tarot, loading, error, refresh } = useDailyTarot();

	return (
		<ScrollView className="flex-1" contentContainerClassName="px-5 pt-12 pb-10">
			<Text className="text-center font-display text-4xl font-bold text-foreground">
				Today&apos;s Tarot
			</Text>
			<Text className="mt-2 text-center font-body text-lg text-text-muted">
				One card, one message.
			</Text>

			<View className="mt-7 rounded-2xl border border-border/40 bg-card p-4">
				{loading ? (
					<Text className="font-body text-sm text-text-muted">Drawing your card...</Text>
				) : error ? (
					<Text className="font-body text-sm text-[#F4B8B8]">{error}</Text>
				) : tarot ? (
					<>
						<Text className="font-display text-2xl text-card-foreground">
							{tarot.card.name}
						</Text>
						<Text className="mt-2 font-body text-base leading-6 text-text-muted">
							{tarot.insight}
						</Text>
						{!!tarot.card.meaning && (
							<Text className="mt-4 font-body text-sm text-text-muted">
								Meaning: {tarot.card.meaning}
							</Text>
						)}
					</>
				) : (
					<Text className="font-body text-sm text-text-muted">
						No tarot card available right now.
					</Text>
				)}

				<View className="mt-4">
					<Button onPress={() => void refresh()} size="md">
						Draw a new card
					</Button>
				</View>
			</View>

			<View className="mt-5 flex-row gap-3">
				<Link href="/cards" asChild>
					<Pressable className="flex-1 rounded-xl border border-border/40 px-4 py-3">
						<Text className="text-center font-body text-sm font-semibold text-foreground">
							All tarot cards
						</Text>
					</Pressable>
				</Link>
				<Link href="/home" asChild>
					<Pressable className="flex-1 rounded-xl border border-border/40 px-4 py-3">
						<Text className="text-center font-body text-sm font-semibold text-foreground">
							Back to home
						</Text>
					</Pressable>
				</Link>
			</View>
		</ScrollView>
	);
}
