import { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type ButtonVariant = "default" | "outline";

interface ButtonProps {
	children: ReactNode;
	onPress: () => void;
	variant?: ButtonVariant;
	size?: "lg" | "md";
	disabled?: boolean;
}

export function Button({
	children,
	onPress,
	variant = "default",
	size = "lg",
	disabled = false,
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
			]}>
			{label}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	base: {
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
	},
	sizeLarge: {
		paddingVertical: 14,
		paddingHorizontal: 20,
	},
	sizeMedium: {
		paddingVertical: 10,
		paddingHorizontal: 16,
	},
	default: {
		backgroundColor: "#B87D56",
	},
	outline: {
		borderWidth: 1,
		borderColor: "rgba(237, 232, 216, 0.32)",
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
		fontSize: 16,
	},
	labelMedium: {
		fontSize: 14,
	},
	labelDefault: {
		color: "#433A5C",
	},
	labelOutline: {
		color: "#EDE8D8",
	},
});

export default Button;
