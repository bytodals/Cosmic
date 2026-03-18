import { useEffect, useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { zodiacSignsBySlug } from "../../data/Zodiacs";
import { fetchZodiacOverview } from "../../lib/api";
import type { ZodiacId } from "../../types";

export default function HoroscopeDetail() {
	const { sign } = useLocalSearchParams<{ sign: string }>();
	const normalizedSign = typeof sign === "string" ? sign.toLowerCase() : "";
	const zodiacSign =
		normalizedSign && normalizedSign in zodiacSignsBySlug
			? zodiacSignsBySlug[normalizedSign as ZodiacId]
			: undefined;
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [overview, setOverview] = useState<{
		title: string;
		overview: string;
		strengths: string[];
		challenges: string[];
		compatibility: string[];
		luckyColor?: string;
		luckyDay?: string;
		luckyNumbers?: string[];
	} | null>(null);

	useEffect(() => {
		if (!zodiacSign) {
			setOverview(null);
			return;
		}

		let isMounted = true;

		const loadOverview = async () => {
			setLoading(true);
			setError(null);

			try {
				const data = await fetchZodiacOverview(zodiacSign.slug);
				if (!isMounted) {
					return;
				}

				setOverview(data);
			} catch (fetchError) {
				if (!isMounted) {
					return;
				}

				setError(
					fetchError instanceof Error
						? fetchError.message
						: "Could not load zodiac details right now.",
				);
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		void loadOverview();

		return () => {
			isMounted = false;
		};
	}, [zodiacSign]);

	if (!zodiacSign) {
		return (
			<View className="flex-1 justify-center px-6">
				<View className="rounded-2xl border border-border/40 bg-card p-6">
					<Text className="font-display text-2xl text-card-foreground">
						Unknown zodiac sign
					</Text>
					<Text className="mt-2 font-body text-base text-text-muted">
						We couldn&apos;t match that sign. Return to the zodiac cards and try
						again.
					</Text>
					<Link href="/home" asChild>
						<Pressable className="mt-4 rounded-xl border border-border/40 px-4 py-3">
							<Text className="text-center font-body text-sm font-semibold text-card-foreground">
								Back to cards
							</Text>
						</Pressable>
					</Link>
				</View>
			</View>
		);
	}

	return (
		<ScrollView className="flex-1" contentContainerClassName="px-5 pt-12 pb-10">
			<Text className="text-center font-display text-4xl font-bold text-foreground">
				{zodiacSign.name}
			</Text>
			<Text className="mt-2 text-center font-body text-base text-text-muted">
				General zodiac information from API
			</Text>

			<View className="mt-7 rounded-2xl border border-border/40 bg-card p-4">
				<Text className="font-body text-sm text-text-muted">
					Element: {zodiacSign.element}
				</Text>
				<Text className="mt-1 font-body text-sm text-text-muted">
					Date range: {zodiacSign.dateRange}
				</Text>

				{loading && (
					<View className="mt-4 flex-row items-center gap-2">
						<ActivityIndicator color="#D4C0F7" size="small" />
						<Text className="font-body text-sm text-text-muted">Loading info...</Text>
					</View>
				)}

				{error && !loading && (
					<Text className="mt-4 font-body text-sm text-[#F4B8B8]">{error}</Text>
				)}

				{!!overview && (
					<>
						<Text className="mt-4 font-display text-2xl text-card-foreground">
							{overview.title}
						</Text>
						<Text className="mt-2 font-body text-base leading-6 text-text-muted">
							{overview.overview}
						</Text>

						<Text className="mt-4 font-body text-sm font-semibold text-card-foreground">
							Strengths
						</Text>
						<Text className="mt-1 font-body text-sm text-text-muted">
							{overview.strengths.join(" • ")}
						</Text>

						<Text className="mt-4 font-body text-sm font-semibold text-card-foreground">
							Challenges
						</Text>
						<Text className="mt-1 font-body text-sm text-text-muted">
							{overview.challenges.join(" • ")}
						</Text>

						<Text className="mt-4 font-body text-sm font-semibold text-card-foreground">
							Compatibility
						</Text>
						<Text className="mt-1 font-body text-sm text-text-muted">
							{overview.compatibility.join(" • ")}
						</Text>

						{!!overview.luckyColor && (
							<Text className="mt-4 font-body text-sm text-text-muted">
								Lucky color: {overview.luckyColor}
							</Text>
						)}
						{!!overview.luckyDay && (
							<Text className="mt-1 font-body text-sm text-text-muted">
								Lucky day: {overview.luckyDay}
							</Text>
						)}
						{!!overview.luckyNumbers?.length && (
							<Text className="mt-1 font-body text-sm text-text-muted">
								Lucky numbers: {overview.luckyNumbers.join(", ")}
							</Text>
						)}
					</>
				)}
			</View>

			<Link href="/home" asChild>
				<Pressable className="mt-5 rounded-xl border border-border/40 px-4 py-3">
					<Text className="text-center font-body text-sm font-semibold text-foreground">
						Back to zodiac cards
					</Text>
				</Pressable>
			</Link>
		</ScrollView>
	);
}
