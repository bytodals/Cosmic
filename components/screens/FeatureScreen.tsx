import { ReactNode } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { colors, spacing, radii, fontSizes } from "../../constants/theme";

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
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing['3xl'],
	},
	card: {
		borderRadius: radii.xl,
		backgroundColor: colors.featureBackground,
		padding: spacing.xl,
		...Platform.select({
			web: {
				boxShadow: `0 8px 18px rgba(0, 0, 0, 0.16)`,
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
		marginBottom: spacing.sm,
		color: colors.starCore,
		fontSize: fontSizes.sm,
		fontWeight: "700",
		letterSpacing: 1,
		textTransform: "uppercase",
	},
	title: {
		color: "foreground",
		fontSize: fontSizes['2xl'],
		fontWeight: "700",
	},
	subtitle: {
		marginTop: spacing.sm,
		color: colors.nebulaMist,
		fontSize: fontSizes.lg,
		fontWeight: "600",
	},
	description: {
		marginTop: spacing.lg,
		color: colors.nebulaMist,
		fontSize: fontSizes.md,
		lineHeight: Math.round(fontSizes.md * 1.5),
	},
});
