import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useRouter } from "expo-router";
import {
	getBirthDetails,
	hasCompletedBirthDetails,
} from "@/lib/birthDetailsStorage";

export default function IndexScreen() {
	const router = useRouter();

	useEffect(() => {
		let isMounted = true;

		const resolveStartPage = async () => {
			const details = await getBirthDetails();

			if (!isMounted) {
				return;
			}

			if (hasCompletedBirthDetails(details)) {
				router.replace("/daily");
				return;
			}

			router.replace("/home");
		};

		void resolveStartPage();

		return () => {
			isMounted = false;
		};
	}, [router]);

	return (
		<View className="flex-1 items-center justify-center px-6">
			<ActivityIndicator color="#D4C0F7" size="large" />
			<Text className="mt-4 text-center font-body text-base text-text-muted">
				Aligning your cosmic start page...
			</Text>
		</View>
	);
}
