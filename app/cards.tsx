import { useEffect, useMemo, useState } from "react";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { fetchTarotCardsLibrary } from "@/lib/api";
import type { TarotCard } from "@/types";

export default function Cards() {
	const [cards, setCards] = useState<TarotCard[]>([]);
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const loadCards = async () => {
			setLoading(true);
			setError(null);

			try {
				const value = await fetchTarotCardsLibrary();
				if (isMounted) {
					setCards(value);
				}
			} catch (fetchError) {
				if (!isMounted) {
					return;
				}

				setError(
					fetchError instanceof Error
						? fetchError.message
						: "Could not load tarot cards.",
				);
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		void loadCards();

		return () => {
			isMounted = false;
		};
	}, []);

	const normalizedQuery = query.trim().toLowerCase();

	const filteredCards = useMemo(() => {
		if (!normalizedQuery) {
			return cards;
		}

		return cards.filter((card) => {
			const haystack = [
				card.name,
				card.meaning,
				...(card.keywords ?? []),
				card.arcana ?? "",
			]
				.join(" ")
				.toLowerCase();

			return haystack.includes(normalizedQuery);
		});
	}, [cards, normalizedQuery]);

	return (
		<ScrollView className="flex-1" contentContainerClassName="px-5 pt-12 pb-10">
			<Text className="text-center font-display text-4xl font-bold text-foreground">
				Tarot Library
			</Text>
			<Text className="mt-2 text-center font-body text-lg text-text-muted">
				Search all tarot cards and meanings.
			</Text>

			<TextInput
				className="mt-6 rounded-xl border border-border/40 bg-card px-4 py-3 font-body text-base text-card-foreground"
				placeholder="Search card name or meaning"
				placeholderTextColor="#7A7194"
				value={query}
				onChangeText={setQuery}
			/>

			{loading ? (
				<Text className="mt-5 font-body text-sm text-text-muted">Loading cards...</Text>
			) : error ? (
				<Text className="mt-5 font-body text-sm text-[#F4B8B8]">{error}</Text>
			) : filteredCards.length === 0 ? (
				<Text className="mt-5 font-body text-sm text-text-muted">
					No cards matched your search.
				</Text>
			) : (
				<View className="mt-5 gap-3">
					{filteredCards.map((card) => (
						<View
							key={card.name}
							className="rounded-2xl border border-border/40 bg-card p-4">
							<Text className="font-display text-2xl text-card-foreground">
								{card.name}
							</Text>
							<Text className="mt-2 font-body text-sm leading-6 text-text-muted">
								{card.meaning}
							</Text>
							{!!card.keywords?.length && (
								<Text className="mt-3 font-body text-xs text-text-muted">
									Keywords: {card.keywords.join(" • ")}
								</Text>
							)}
						</View>
					))}
				</View>
			)}

			<View className="mt-5 flex-row gap-3">
				<Link href="/tarot" asChild>
					<Pressable className="flex-1 rounded-xl border border-border/40 px-4 py-3">
						<Text className="text-center font-body text-sm font-semibold text-foreground">
							Daily tarot
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
