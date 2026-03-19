import "../globals.css";
import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { Platform, View, Pressable, Text, StyleSheet } from "react-native";
import StarField from "@/components/effects/StarField";
import { colors } from "@/constants/theme";

export default function RootLayout() {
	useEffect(() => {
		if (Platform.OS !== "web") {
			return;
		}

		const head = globalThis.document?.head;
		if (!head) {
			return;
		}

		let favicon = head.querySelector<HTMLLinkElement>(
			'link[data-cosmic-favicon="true"]',
		);

		if (!favicon) {
			favicon = globalThis.document.createElement("link");
			favicon.rel = "icon";
			favicon.type = "image/svg+xml";
			favicon.setAttribute("data-cosmic-favicon", "true");
			head.appendChild(favicon);
		}

		favicon.href = "/favicon.svg";
	}, []);

	return (
		<View className="flex-1 bg-background">
			<StarField />

			<View className="z-10 flex-1" style={{ paddingTop: 10 }}>
				<AppHeader />
				<Stack
          screenOptions={{
            headerShown: false,
				contentStyle: { backgroundColor: "transparent" },
          }}
          initialRouteName="index">
          <Stack.Screen name="index" />
					<Stack.Screen name="daily" />
		        <Stack.Screen name="horoscope/[sign]" />
	          <Stack.Screen name="tarot/about-tarot" />
	      	  <Stack.Screen name="tarot/index" />
        </Stack>
			</View>
		</View>
	);
}

function AppHeader() {
	const router = useRouter();
	const segments = useSegments();

	// Hide on index (root) — only show when there are nested segments
	if (!segments || (segments.length as number) === 0) return null;

	return (
		<Pressable
			onPress={() => router.back()}
			style={styles.backButton}
			accessibilityLabel="Back"
		>
			<Text style={styles.backText}>{"<"}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	backButton: {
		position: "absolute",
		top: Platform.OS === "ios" ? 44 : 14,
		left: 12,
		zIndex: 1000,
		padding: 8,
		borderRadius: 8,
	},
	backText: {
		color: colors.foreground,
		fontSize: 20,
		fontWeight: "600",
	},
});
