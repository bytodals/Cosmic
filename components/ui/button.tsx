import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, Platform } from "react-native";
import { colors, spacing, radii, fontSizes } from "@/constants/theme";

type ButtonVariant = "default" | "outline";

interface ButtonProps {
	children: ReactNode;
	onPress?: () => void;
	variant?: ButtonVariant;
	size?: "xl" | "lg" | "md";
	disabled?: boolean;
	style?: any;
}

export function Button({
	children,
	onPress,
	variant = "default",
	size = "lg",
	disabled = false,
	style,
}: ButtonProps) {
	const isOutline = variant === "outline";
	const shouldShowOutline = isOutline && Platform.OS === 'web';
	const label =
		typeof children === "string" || typeof children === "number" ? (
			<Text
				style={[
					styles.label,
					size === "xl"
						? styles.labelXL
						: size === "lg"
						? styles.labelLarge
						: styles.labelMedium,
					shouldShowOutline ? styles.labelOutline : styles.labelDefault,
				]}>
				{children}
			</Text>
		) : (
			children
		);

	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			style={({ pressed }) => [
				styles.base,
				size === "xl" ? styles.sizeXL : size === "lg" ? styles.sizeLarge : styles.sizeMedium,
				shouldShowOutline ? styles.outline : styles.default,
				disabled && styles.disabled,
				pressed && !disabled && styles.pressed,
				style,
			]}>
			{label}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	base: {
		borderRadius: radii.btn,
		alignItems: "center",
		justifyContent: "center",
	},
	sizeLarge: {
			paddingVertical: spacing.lg,
			paddingHorizontal: spacing.xl,
	},
	sizeXL: {
			paddingVertical: spacing.xl,
			paddingHorizontal: spacing['2xl'],
	},
	sizeMedium: {
			paddingVertical: spacing.md,
			paddingHorizontal: spacing.lg,
	},
	default: {
		backgroundColor: colors.primary,
		// filled buttons don't need a visible border (it blended with the
		// primary background). Keep background only for contrast on dark UI.
	},
	outline: {
		borderWidth: 1,
		borderColor: colors.borderLight,
		backgroundColor: "transparent",
	},
	disabled: {
		opacity: 0.55,
	},
	pressed: {
		opacity: 0.9,
	},
	label: {
		fontWeight: "600",
	},
	labelLarge: {
		fontSize: fontSizes.lg,
	},
	labelXL: {
		fontSize: fontSizes.xl,
	},
	labelMedium: {
		fontSize: fontSizes.sm2,
	},
	labelDefault: {
		color: colors.primaryForeground,
	},
	labelOutline: {
		color: colors.foreground,
	},
});

export default Button;
