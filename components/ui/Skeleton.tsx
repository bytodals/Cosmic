// components/ui/Skeleton.tsx
// Placeholder component shown while data is loading.
// Gives better UX than just a spinner (VG polish).

import { View } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = 20,
  className = '',
}: SkeletonProps) {
  return (
    <View
      className={`bg-muted/40 animate-pulse rounded-xl ${className}`}
      style={{ width, height }}
    />
  );
}