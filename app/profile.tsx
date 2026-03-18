import { useCallback, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import {
	ActivityIndicator,
	Alert,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import BirthDetailsModal from "@/components/BirthDetailsModal";
import Button from "@/components/ui/button";
import { fetchBirthChartSummary } from "@/lib/api";
import {
	BirthDetails,
	clearBirthDetails,
	getBirthDetails,
	hasCompletedBirthDetails,
} from "@/lib/birthDetailsStorage";

export default function ProfileScreen() {
	const [details, setDetails] = useState<BirthDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [chart, setChart] = useState<{
		moonSign: string;
		ascendantSign: string;
		summary?: string;
	} | null>(null);
	const [chartLoading, setChartLoading] = useState(false);

	const loadProfile = useCallback(async () => {
		setLoading(true);
		const storedDetails = await getBirthDetails();
		setDetails(storedDetails);
		setModalOpen(!hasCompletedBirthDetails(storedDetails));
		setLoading(false);

		if (!hasCompletedBirthDetails(storedDetails)) {
			setChart(null);
			return;
		}

		setChartLoading(true);
		const chartSummary = await fetchBirthChartSummary(storedDetails);
		setChart(chartSummary);
		setChartLoading(false);
	}, []);

	useFocusEffect(
		useCallback(() => {
			void loadProfile();
		}, [loadProfile]),
	);

	const handleSave = async (value: BirthDetails, _rememberMe: boolean) => {
		setSaving(true);
		try {
			void _rememberMe;
			setDetails(value);
			setModalOpen(false);

			setChartLoading(true);
			const chartSummary = await fetchBirthChartSummary(value);
			setChart(chartSummary);
			setChartLoading(false);
		} finally {
			setSaving(false);
		}
	};

	const handleClearDetails = () => {
		Alert.alert(
			"Clear saved profile?",
			"This removes your saved birth details on this device. You can add new details right away.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Clear",
					style: "destructive",
					onPress: () => {
						void (async () => {
							await clearBirthDetails();
							setDetails(null);
							setChart(null);
							setModalOpen(true);
						})();
					},
				},
			],
		);
	};

	return (
		<>
			<ScrollView className="flex-1" contentContainerClassName="px-5 pt-12 pb-10">
				<Text className="text-center font-display text-4xl font-bold text-foreground">
					Your cosmic profile
				</Text>
				<Text className="mt-2 text-center font-body text-lg text-text-muted">
					Save your birth details and choose if this device should remember them.
				</Text>

				{loading ? (
					<View className="mt-10 items-center">
						<ActivityIndicator color="#D4C0F7" size="large" />
					</View>
				) : (
					<View className="mt-8 rounded-2xl border border-border/40 bg-card p-5">
						{hasCompletedBirthDetails(details) ? (
							<>
								<Text className="font-display text-2xl text-card-foreground">
									{details.fullName}
								</Text>
								<Text className="mt-2 font-body text-sm text-text-muted">
									Birth date: {details.birthDate}
								</Text>
								<Text className="mt-1 font-body text-sm text-text-muted">
									Birth time: {details.birthTime || "Not set"}
								</Text>
								<Text className="mt-1 font-body text-sm text-text-muted">
									Birth place: {details.birthPlace || "Not set"}
								</Text>
								<Text className="mt-1 font-body text-sm text-text-muted">
									Sun sign: {details.zodiacSign || "Unknown"}
								</Text>

								{chartLoading && (
									<Text className="mt-3 font-body text-sm text-text-muted">
										Calculating moon sign and ascendant from API...
									</Text>
								)}

								{!chartLoading && chart && (
									<>
										<Text className="mt-3 font-body text-sm text-text-muted">
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
									<Text className="mt-3 font-body text-sm text-text-muted">
										Moon sign + ascendant need a supported birth-chart API configured
										in `.env`.
									</Text>
								)}

								<View className="mt-5">
									<Button onPress={() => setModalOpen(true)} size="md">
										Edit birth details
									</Button>
								</View>
								<View className="mt-3">
									<Button
										onPress={handleClearDetails}
										variant="outline"
										size="md">
										Clear saved details
									</Button>
								</View>
							</>
						) : (
							<>
								<Text className="font-body text-base text-text-muted">
									No saved birth details yet. Add them to personalize your daily
									horoscope and tarot.
								</Text>
								<View className="mt-4">
									<Button onPress={() => setModalOpen(true)} size="md">
										Add birth details
									</Button>
								</View>
							</>
						)}
					</View>
				)}

				<View className="mt-5 flex-row gap-3">
					<Link href="/home" asChild>
						<Pressable className="flex-1 rounded-xl border border-border/40 px-4 py-3">
							<Text className="text-center font-body text-sm font-semibold text-foreground">
								Browse zodiac cards
							</Text>
						</Pressable>
					</Link>
					<Link href="/daily" asChild>
						<Pressable className="flex-1 rounded-xl border border-border/40 px-4 py-3">
							<Text className="text-center font-body text-sm font-semibold text-foreground">
								Go to daily page
							</Text>
						</Pressable>
					</Link>
				</View>
			</ScrollView>

			<BirthDetailsModal
				open={modalOpen}
				initialValue={details}
				isSaving={saving}
				onClose={() => setModalOpen(false)}
				onSave={handleSave}
			/>
		</>
	);
}
