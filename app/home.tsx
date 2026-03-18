import { useCallback, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { zodiacSigns } from "@/data/Zodiacs";
import ZodiacCard from "@/components/ZodiacCard";
import {
	getBirthDetails,
	hasCompletedBirthDetails,
} from "@/lib/birthDetailsStorage";

export default function HomeScreen() {
	const [hasSavedDetails, setHasSavedDetails] = useState(false);
	const [firstName, setFirstName] = useState<string | null>(null);

	useFocusEffect(
		useCallback(() => {
			let isMounted = true;

			const hydrateProfileState = async () => {
				const details = await getBirthDetails();

				if (!isMounted) {
					return;
				}

				const completed = hasCompletedBirthDetails(details);
				setHasSavedDetails(completed);
				setFirstName(
					completed
						? details.fullName.trim().split(" ")[0] || details.fullName.trim()
						: null,
				);
			};

			void hydrateProfileState();

			return () => {
				isMounted = false;
			};
		}, []),
	);

	return (
		<View className="flex-1">
			<ScrollView className="flex-1" contentContainerClassName="px-5 pt-12 pb-10">
				<Text className="mb-3 mt-8 text-center font-display text-4xl font-semibold text-secondary">
					Cosmic
				</Text>
				<Text className="mb-6 text-center font-body text-xl text-text-muted">
					explore your cosmic insights
					{firstName ? `, ${firstName}` : ""}
				</Text>

				<View className="mb-7 flex-row gap-3">
					<Link href="/profile" asChild>
						<Pressable className="flex-1 rounded-2xl border border-border/40 bg-card px-4 py-3">
							<Text className="font-body text-sm font-semibold text-card-foreground">
								Birth details
							</Text>
							<Text className="mt-1 font-body text-xs text-text-muted">
								Save once or clear anytime
							</Text>
						</Pressable>
					</Link>

					<Link href="/daily" asChild>
						<Pressable className="flex-1 rounded-2xl border border-border/40 bg-card px-4 py-3">
							<Text className="font-body text-sm font-semibold text-card-foreground">
								Daily insights
							</Text>
							<Text className="mt-1 font-body text-xs text-text-muted">
								{hasSavedDetails
									? "Personal horoscope + tarot"
									: "Add birth details for personalized readings"}
							</Text>
						</Pressable>
					</Link>
				</View>

				<Text className="mb-3 pl-2 font-display text-1xl text-card-foreground">
					read about your zodiac sign
				</Text>

				<View className="gap-4">
					{zodiacSigns.map((sign) => (
						<ZodiacCard key={sign.id} sign={sign} />
					))}
				</View>

				<View className="mt-10 rounded-2xl border border-border/40 bg-card p-4">
					<Text className="font-display text-2xl text-card-foreground">Tarot cards</Text>
					<Text className="mt-2 font-body text-sm text-text-muted">
						Explore all tarot card meanings or draw today&apos;s card with a daily
						insight.
					</Text>
					<View className="mt-4 flex-row gap-3">
						<Link href="/tarot" asChild>
							<Pressable className="flex-1 rounded-xl bg-[#2B2340] px-3 py-2">
								<Text className="font-body text-sm font-semibold text-foreground">
									Daily tarot
								</Text>
							</Pressable>
						</Link>
						<Link href="/cards" asChild>
							<Pressable className="flex-1 rounded-xl bg-[#2B2340] px-3 py-2">
								<Text className="font-body text-sm font-semibold text-foreground">
									All tarot cards
								</Text>
							</Pressable>
						</Link>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
