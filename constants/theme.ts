export const colors = {
  // basic 
  background: '#0A0A0C',
  foreground: '#ede8d8',
  primary: "#F7B4E8",
  primaryForeground: '#6E6FAF',
  // darker glow variant used shadows
  primaryGlow: 'rgba(67,58,92,0.72)',
  // secondary color used for zodiac emoji
  secondary: '#858EC4',
  mutedForeground: '#8a82a0',
  borderLight: 'rgba(237, 232, 216, 0.32)',
  featureBackground: 'rgba(27, 22, 40, 0.92)',
  // Starfield / accent tones 
  starGlow: 'rgba(196, 170, 235, 0.7)',
  starGlowShadow: '#d2bcf0',
  starCore: 'rgba(244, 236, 255, 0.72)',
  starCoreShadow: '#8f7adf',
  nebulaMist: 'rgba(179,145,245,0.08)',
  nebulaOneGradient: [
    'rgba(0,0,0,0.21)',
    'rgba(0,0,0,0.22)',
    'rgba(0,0,0,0.16)',
    'rgba(45,42,75,0.39)'
  ] as const,
  nebulaTwoGradient: [
    'rgba(112,5,41,0.14)',
    'rgba(112,5,41,0.14)',
    'rgba(100,13,49,0.128)',
    'rgba(151,45,73,0.14)'
  ] as const,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
} as const;


export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  btn: 18,
  full: 9999,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 13,
  sm2: 14,
  md: 16,
  lg: 18,
  xl: 24,
  '2xl': 30,
  '3xl': 36,
} as const;

export const theme = {
  colors,
  spacing,
  radii,
  fontSizes,
} as const;