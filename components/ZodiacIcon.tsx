import { Text, View } from "react-native";

interface ZodiacIconProps {
	symbol: string;
	size?: number;
	color?: string;
}

export default function ZodiacIcon({
	symbol,
	size = 34,
	color = "#BEAEFD",
}: ZodiacIconProps) {
	return (
		<View
			style={{
				width: size,
				height: size,
				alignItems: "center",
				justifyContent: "center",
			}}>
			<Text style={{ fontSize: size, color, lineHeight: size }}>{symbol}</Text>
		</View>
	);
}
