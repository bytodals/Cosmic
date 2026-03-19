// Reusable card 
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  glass?: boolean;
}

export function Card({ glass = false, className = '', children, ...props }: CardProps) {
  const base = 'rounded-3xl p-6 overflow-hidden';
  const glassStyle = glass
    ? 'bg-cardGlass backdrop-blur-2xl border border-border shadow-2xl shadow-primary/10'
    : 'bg-card border border-border/50';

  return (
    <View className={`${base} ${glassStyle} ${className}`} {...props}>
      {children}
    </View>
  );
}