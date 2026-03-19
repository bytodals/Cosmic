import { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, spacing, radii, fontSizes } from "@/constants/theme";

type ButtonVariant = "default" | "outline";

interface ButtonProps {
	children: ReactNode;
	onPress?: () => void;
	variant?: ButtonVariant;
	size?: "lg" | "md";
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
	const label =
		typeof children === "string" || typeof children === "number" ? (
			<Text
				style={[
					styles.label,
					size === "lg" ? styles.labelLarge : styles.labelMedium,
					isOutline ? styles.labelOutline : styles.labelDefault,
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
				size === "lg" ? styles.sizeLarge : styles.sizeMedium,
				isOutline ? styles.outline : styles.default,
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
	sizeMedium: {
			paddingVertical: spacing.md,
			paddingHorizontal: spacing.lg,
	},
	default: {
		backgroundColor: colors.primary,
		borderWidth: 0,
		borderColor: "transparent",
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
		fontSize: fontSizes.md,
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
