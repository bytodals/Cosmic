import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ZodiacSign } from "@/types";
import ZodiacIcon from "./ZodiacIcon";

type ZodiacCardProps = {
	sign: ZodiacSign;
};

export default function ZodiacCard({ sign }: ZodiacCardProps) {
	return (
		<Link
			href={{ pathname: "/horoscope/[sign]", params: { sign: sign.slug } }}
			asChild>
			<Pressable
				className="rounded-2xl border border-border/40 bg-card p-4"
				style={({ pressed }) => [pressed && styles.cardPressed]}>
				<View className="mb-1.5 flex-row items-center gap-2">
					<ZodiacIcon symbol={sign.symbol} />
					<Text className="font-display text-xl font-bold text-card-foreground">
						{sign.name}
					</Text>
				</View>
				<Text className="font-body text-sm text-text-muted">{sign.dateRange}</Text>
				<Text className="font-body text-sm text-text-muted">
					Element: {sign.element}
				</Text>
			</Pressable>
		</Link>
	);
}

const styles = StyleSheet.create({
	cardPressed: {
		opacity: 0.9,
		transform: [{ scale: 0.99 }],
	},
});
