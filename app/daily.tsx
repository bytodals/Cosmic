import { useCallback, useMemo, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import Button from "@/components/ui/button";
import { useDailyHoroscope } from "@/hooks/useDailyHoroscope";
import { useDailyTarot } from "@/hooks/useDailyTarot";
import {
	BirthDetails,
	getBirthDetails,
	hasCompletedBirthDetails,
	inferZodiacSignFromBirthDate,
} from "@/lib/birthDetailsStorage";
import { fetchBirthChartSummary } from "@/lib/api";

export default function DailyScreen() {
	const [details, setDetails] = useState<BirthDetails | null>(null);
	const [loadingProfile, setLoadingProfile] = useState(true);
	const [chart, setChart] = useState<{
		moonSign: string;
		ascendantSign: string;
		summary?: string;
	} | null>(null);
	const [chartLoading, setChartLoading] = useState(false);

	useFocusEffect(
		useCallback(() => {
			let isMounted = true;

			const loadProfile = async () => {
				setLoadingProfile(true);
				const savedDetails = await getBirthDetails();

				if (!isMounted) {
					return;
				}

				setDetails(savedDetails);
				setLoadingProfile(false);

				if (!hasCompletedBirthDetails(savedDetails)) {
					setChart(null);
					return;
				}

				setChartLoading(true);
				const chartSummary = await fetchBirthChartSummary(savedDetails);

				if (!isMounted) {
					return;
				}

				setChart(chartSummary);
				setChartLoading(false);
			};

			void loadProfile();

			return () => {
				isMounted = false;
			};
		}, []),
	);

	const zodiacSign = useMemo(() => {
		if (!details) {
			return "";
		}

		return details.zodiacSign || inferZodiacSignFromBirthDate(details.birthDate) || "";
	}, [details]);

	const horoscope = useDailyHoroscope(zodiacSign, {
		fullName: details?.fullName,
		moonSign: chart?.moonSign,
		ascendantSign: chart?.ascendantSign,
	});
	const tarot = useDailyTarot();

	if (loadingProfile) {
		return (
			<View className="flex-1 items-center justify-center px-6">
				<ActivityIndicator color="#D4C0F7" size="large" />
				<Text className="mt-4 text-center font-body text-base text-text-muted">
					Preparing your personal cosmic view...
				</Text>
			</View>
		);
	}

	if (!hasCompletedBirthDetails(details)) {
		return (
			<View className="flex-1 justify-center px-6">
				<View className="rounded-3xl border border-border/40 bg-card p-6">
					<Text className="font-display text-3xl text-card-foreground">
						Add your birth details first
					</Text>
					<Text className="mt-3 font-body text-base text-text-muted">
						Add birth date, time and place to personalize your daily horoscope,
						tarot, moon sign and ascendant.
					</Text>
					<View className="mt-5 gap-3">
						<Link href="/profile" asChild>
							<Pressable className="rounded-xl bg-[#B87D56] px-4 py-3">
								<Text className="text-center font-body font-semibold text-foreground">
									Add birth details
								</Text>
							</Pressable>
						</Link>
						<Link href="/home" asChild>
							<Pressable className="rounded-xl border border-border/40 px-4 py-3">
								<Text className="text-center font-body font-semibold text-card-foreground">
									Back to zodiac cards
								</Text>
							</Pressable>
						</Link>
					</View>
				</View>
			</View>
		);
	}

	const firstName = details.fullName.trim().split(" ")[0] || details.fullName;

	return (
		<ScrollView className="flex-1" contentContainerClassName="px-5 pt-12 pb-10">
			<Text className="text-center font-display text-4xl font-bold text-foreground">
				Daily Cosmic
			</Text>
			<Text className="mt-2 text-center font-body text-lg text-text-muted">
				Hi {firstName}, here&apos;s your personal energy for today.
			</Text>

			<View className="mt-7 rounded-2xl border border-border/40 bg-card p-4">
				<Text className="font-display text-xl text-card-foreground">Your chart profile</Text>
				<Text className="mt-2 font-body text-sm text-text-muted">
					Sun sign: {zodiacSign || "Unknown"}
				</Text>
				{chartLoading && (
					<Text className="mt-1 font-body text-sm text-text-muted">
						Calculating moon sign and ascendant from API...
					</Text>
				)}
				{!chartLoading && chart && (
					<>
						<Text className="mt-1 font-body text-sm text-text-muted">
							Moon sign: {chart.moonSign}
						</Text>
						<Text className="mt-1 font-body text-sm text-text-muted">
							Ascendant: {chart.ascendantSign}
						</Text>
						{!!chart.summary && (
							<Text className="mt-2 font-body text-sm text-text-muted">
								{chart.summary}
							</Text>
						)}
					</>
				)}
				{!chartLoading && !chart && (
					<Text className="mt-1 font-body text-sm text-text-muted">
						Moon sign + ascendant need API support for birth chart in your `.env`.
					</Text>
				)}
			</View>

			<View className="mt-4 rounded-2xl border border-border/40 bg-card p-4">
				<Text className="font-display text-xl text-card-foreground">
					Today&apos;s personalized horoscope
				</Text>
				{horoscope.loading ? (
					<Text className="mt-3 font-body text-sm text-text-muted">Loading...</Text>
				) : horoscope.error ? (
					<Text className="mt-3 font-body text-sm text-[#F4B8B8]">
						{horoscope.error}
					</Text>
				) : (
					<Text className="mt-3 font-body text-base leading-6 text-text-muted">
						{horoscope.horoscope}
					</Text>
				)}

				<View className="mt-4">
					<Button onPress={() => void horoscope.refresh()} size="md">
						Refresh horoscope
					</Button>
				</View>
			</View>

			<View className="mt-4 rounded-2xl border border-border/40 bg-card p-4">
				<Text className="font-display text-xl text-card-foreground">
					Today&apos;s tarot insight
				</Text>
				{tarot.loading ? (
					<Text className="mt-3 font-body text-sm text-text-muted">Drawing your card...</Text>
				) : tarot.error ? (
					<Text className="mt-3 font-body text-sm text-[#F4B8B8]">{tarot.error}</Text>
				) : tarot.tarot ? (
					<>
						<Text className="mt-3 font-body text-base font-semibold text-card-foreground">
							{tarot.tarot.card.name}
						</Text>
						<Text className="mt-2 font-body text-base leading-6 text-text-muted">
							{tarot.tarot.insight}
						</Text>
					</>
				) : null}

				<View className="mt-4 flex-row gap-3">
					<View className="flex-1">
						<Button onPress={() => void tarot.refresh()} size="md">
							Draw again
						</Button>
					</View>
					<Link href="/cards" asChild>
						<Pressable className="flex-1 rounded-xl border border-border/40 px-4 py-2">
							<Text className="text-center font-body text-sm font-semibold text-card-foreground">
								All tarot cards
							</Text>
						</Pressable>
					</Link>
				</View>
			</View>

			<View className="mt-5 flex-row gap-3">
				<Link href="/home" asChild>
					<Pressable className="flex-1 rounded-xl border border-border/40 px-4 py-3">
						<Text className="text-center font-body text-sm font-semibold text-foreground">
							Browse zodiac cards
						</Text>
					</Pressable>
				</Link>
				<Link href="/profile" asChild>
					<Pressable className="flex-1 rounded-xl border border-border/40 px-4 py-3">
						<Text className="text-center font-body text-sm font-semibold text-foreground">
							Edit profile
						</Text>
					</Pressable>
				</Link>
			</View>
		</ScrollView>
	);
}
