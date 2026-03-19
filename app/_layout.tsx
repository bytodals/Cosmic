import "../globals.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { Platform, View } from "react-native";
import StarField from "@/components/effects/StarField";

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
		<View className="flex-1 bg-background" style={{ backgroundColor: "#0A0A0C" }}>
			<StarField />

			<View className="z-10 flex-1">
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
