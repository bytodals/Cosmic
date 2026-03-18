import { ReactNode } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

type FeatureScreenProps = {
	eyebrow?: string;
	title: string;
	subtitle?: string;
	description: string;
	children?: ReactNode;
};

export default function FeatureScreen({
	eyebrow,
	title,
	subtitle,
	description,
	children,
}: FeatureScreenProps) {
	return (
		<View style={styles.container}>
			<View style={styles.card}>
				{!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
				<Text style={styles.title}>{title}</Text>
				{!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
				<Text style={styles.description}>{description}</Text>
				{children}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 24,
		paddingVertical: 40,
	},
	card: {
		borderRadius: 24,
		backgroundColor: "rgba(27, 22, 40, 0.92)",
		padding: 24,
		...Platform.select({
			web: {
				boxShadow: "0 8px 18px rgba(0, 0, 0, 0.16)",
			},
			default: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 8 },
				shadowOpacity: 0.16,
				shadowRadius: 18,
				elevation: 4,
			},
		}),
	},
	eyebrow: {
		marginBottom: 8,
		color: "#BEAEFD",
		fontSize: 13,
		fontWeight: "700",
		letterSpacing: 1,
		textTransform: "uppercase",
	},
	title: {
		color: "#F8F4FF",
		fontSize: 30,
		fontWeight: "700",
	},
	subtitle: {
		marginTop: 8,
		color: "#CBBFE3",
		fontSize: 18,
		fontWeight: "600",
	},
	description: {
		marginTop: 16,
		color: "#E6DFF7",
		fontSize: 16,
		lineHeight: 24,
	},
});
