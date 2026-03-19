// placeholder while data is loading.

import { View } from "react-native";
import { spacing } from "@/constants/theme";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = spacing.lg,
  className = '',
}: SkeletonProps) {
  const getDimension = (value: number | string | undefined) => {
    if (typeof value === 'number' || value === undefined) return value;
    if (value === 'auto') return value;
      //  percentage, fallback to undeined 
    return undefined;
  };

  return (
    <View
      className={`bg-muted/40 animate-pulse rounded-xl ${className}`}
      style={{ width: getDimension(width), height: getDimension(height) }}
    />
  );
}