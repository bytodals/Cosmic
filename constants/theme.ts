// Central place for ALL design tokens.
// Makes it easy to change colors or spacing everywhere without hunting through files.

export const colors = {
  background: '#0A0A0C',
  foreground: '#ede8d8',
  card: '#231e30',
  cardGlass: 'rgba(35, 30, 48, 0.35)',     // semi-transparent for glass effect
  primary: '#B87D56',
  secondary: '#2e2840',
  muted: '#18171D',
  border: 'rgba(91, 70, 167, 0.4)',
  text: '#ede8d8',
  textMuted: '#B9AFD4',
  error: '#ef4444',
  glow: 'rgba(184, 125, 86, 0.15)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
} as const;