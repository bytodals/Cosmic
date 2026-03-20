import "../globals.css";
import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { Platform, View, Pressable, Text, StyleSheet } from "react-native";
import StarField from "@/components/effects/StarField";
import { colors } from "@/constants/theme";

export default function RootLayout() {
  // only on web
  useEffect(() => {
    if (Platform.OS === "web") {
      const head = document.head;

      let favicon = head.querySelector(
        'link[data-cosmic-favicon="true"]'
      ) as HTMLLinkElement | null;

      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.type = "image/svg+xml";
        favicon.setAttribute("data-cosmic-favicon", "true");
        head.appendChild(favicon);
      }

      favicon.href = "/favicon.svg";
    }
  }, []);


  return (
    <View className="flex-1 bg-background">
      {/* Background */}
      <StarField />

      {/* Header - absolute, sits above content */}
      <AppHeader />

      {/* Main content */}
      {/* top margin so all pages/screens receive consistent spacing */}
      <View className="z-10 flex-1" style={{ paddingTop: Platform.OS === "ios" ? 40 : 60 }}>

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
          initialRouteName="index"
        >
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

// Header with back button
function AppHeader() {
  const router = useRouter();
  const segments = useSegments();

  // Hide on root screen (use existence of first segment to avoid narrow-literal length comparisons)
  if (!segments?.[0]) return null;

  return (
    <Pressable
      onPress={() => router.back()}
      style={styles.backButton}
      accessibilityLabel="Back"
    >
      <Text style={styles.backText}>{"◂"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 44 : 14,
    left: 12,
    zIndex: 1000,
    padding: 12,
    borderRadius: 12,
  },
  backText: {
    color: colors.foreground,
    fontSize: 28,
    fontWeight: "700",
  },
});
