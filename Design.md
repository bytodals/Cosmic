# DESIGN.md — Cosmic UI & design tokens

This document summarizes design principles, design tokens, and component guidelines for the "Cosmic" app.

## Overview

The goal is to keep a consistent visual language (colors, spacing, typography, motion) and provide concrete examples of how tokens are used in code. The authoritative source for tokens is `constants/theme.ts` — update that file first when changing values.

## Design tokens (source: `constants/theme.ts`)

- Colors
  - background: #0A0A0C
  - foreground: #ede8d8
  - primary: #F7B4E8
  - primaryForeground: #6E6FAF
  - primaryGlow: rgba(67,58,92,0.72)
  - secondary: #858EC4
  - mutedForeground: #8a82a0
  - borderLight: rgba(237, 232, 216, 0.32)
  - featureBackground: rgba(27, 22, 40, 0.92)
  - starGlow / starCore / nebula gradients (use as subtle background accents)

- Spacing (px)
  - xs: 4, sm: 8, md: 12, lg: 16, xl: 24, 2xl: 32, 3xl: 40

- Radii (px)
  - sm: 6, md: 10, lg: 16, xl: 24, btn: 18, full: 9999

- Font sizes (px)
  - xs: 12, sm: 13, sm2: 14, md: 16, lg: 18, xl: 24, 2xl: 30, 3xl: 36

## Typography

- Headings: Cinzel (decorative headings)
- Body: Raleway (readable for longer text)
- Size mapping
  - H1: `3xl` (36px)
  - H2: `2xl` (30px)
  - H3: `xl` (24px)
  - Body: `md` (16px)

## Color & contrast rules

- Primary background: `background` (#0A0A0C) — very dark for the mystical feel.
- Primary text: `foreground` (#ede8d8).
- Accent: `primary` is used sparingly for CTAs and highlights (e.g., today's tarot card). Combine with `primaryGlow` for soft shadows.
- Use `borderLight` for subtle dividers inside cards and lists.
- Ensure critical text and icons meet accessibility contrast requirements.

## Spacing & layout

- Use token-based spacing rather than hard-coded numbers.
- Default card: padding `lg` (16), gap `md` (12), borderRadius `md` (10).

## Component guidelines

- Button
  - Default: background `primary`, label color `primaryForeground`, borderRadius `btn` (18).
  - Sizes: small (sm), medium (md), large (xl) — adjust padding with spacing tokens.

- Card
  - Background: `featureBackground` or `background` with an inner panel of `featureBackground`.
  - Border: `borderLight` 1px
  - Radius: `lg` (16)

- Form Input
  - Background: transparent / `featureBackground`
  - Border: `borderLight` 1px
  - Focus: subtle `primaryGlow` shadow

- Modal (BirthDetails, TarotDetails)
  - Centered, max width 92% on small screens, padding `xl` (24)
  - Dim backdrop using `nebulaMist`

- Tarot Card items
  - Layout: image/glyph on top, title below, a small badge for arcana/suit in the corner
  - Use `starGlow` and `starCore` for card shadows/accents

## Motion

- Guidelines
  - Primary transitions: 150–400ms
  - Easing: ease-out-cubic for entrances, ease-in-out for toggles
  - Respect reduced-motion OS settings (useReducedMotion)

- Implementation
  - Use Reanimated for complex motion and the Animated API for simpler transitions
  - StarField runs on optimized loops — keep particle counts low on weaker devices

## Theming & NativeWind (Tailwind)

- Tokens live in `constants/theme.ts` and should be mapped to Tailwind variables in `tailwind.config.ts` when needed.
- Prefer Tailwind classes (`tw` / `className`) for layout and quick styling; use inline styles with `theme` imports when you need JS values (gradients, rgba, shadow colors).

Code example:

```ts
import { theme } from '../constants/theme';

// React Native style
const styles = {
  container: { backgroundColor: theme.colors.background, padding: theme.spacing.lg }
}
```

## Accessibility

- Minimum touch target: 44x44 px
- Verify contrast on critical CTAs and icons
- Test with large text (font scaling)
- Add `accessibilityLabel` and `accessible` to images/icons

## Assets

- Fonts: Cinzel (headings), Raleway (body) — see `app.json` / `expo-font` setup
- Icons: store SVG/PNG in `assets/images` or use an icon set

## StarField (performance)

- Keep particle counts modest: default ~40–80 depending on screen size
- Memoize positions and use native-driven animations where possible

## Design-related file structure

- `constants/theme.ts` — tokens (source of truth)
- `components/ui/` — design primitives (Button, Card, Input, Skeleton)
- `components/effects/StarField.tsx` — visual background effect

## Changelog & contributions

- When you update tokens, update `constants/theme.ts` and add a short note here explaining the change.
