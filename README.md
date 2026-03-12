# Cosmic – Daily Horoscope & Tarot Insights

A mystical mobile app built with **React Native**, **Expo**, **TypeScript** and **NativeWind** (Tailwind CSS for React Native).  
Fetches real-time daily horoscopes and tarot cards from the public [freehoroscopeapi.com](https://freehoroscopeapi.com) API.

**App name:** Cosmic  
**Target platforms:** iOS (tested via Expo Go) + web (localhost development)  
**Course:** App development  
**Goal:** clean code, strong TypeScript usage, custom hooks, robust error handling, dynamic routing, client-side filtering, DRY principles

## Screenshots

(Add your screenshots here later – use Figma frames or Expo snapshots)

- Home screen – Zodiac selection
- Horoscope detail screen (dynamic route)
- Today's Tarot draw
- Tarot card meanings with search/filter
- Birth details modal

## Features

- **12 zodiac signs** with beautiful cards and element styling
- **Daily horoscope** fetched from API (personalized per sign)
- **Today's random tarot card** (pull fresh card on demand)
- **Tarot card database** with full meanings + client-side search/filter (VG requirement)
- **Birth details modal** – saves name/date/place → infers zodiac sign
- Animated **StarField** cosmic background (performance-optimized with useMemo + native animations)
- Full **loading & error states** on all API calls
- Dark mystical UI with custom fonts (Cinzel + Raleway) and Tailwind theme
- Expo Router file-based routing + dynamic params (`/horoscope/[sign]`)
- Type-safe API responses with interfaces
- Custom hooks for data fetching

## Tech Stack

| Category        | Tools / Libraries                               |
| --------------- | ----------------------------------------------- |
| Framework       | React Native + Expo                             |
| Navigation      | Expo Router                                     |
| Styling         | NativeWind (Tailwind CSS)                       |
| Fonts           | Cinzel (headings), Raleway (body) via expo-font |
| State / Storage | React hooks + AsyncStorage                      |
| API             | freehoroscopeapi.com (daily + tarot endpoints)  |
| TypeScript      | Strict mode + custom interfaces                 |
| Animations      | Reanimated + Animated API                       |

## Project Structure

Cosmic/
├── app/ # Expo Router screens & layout
│ ├── \_layout.tsx # Root layout + StarField bg
│ ├── index.tsx # Home – zodiac list
│ ├── horoscope/[sign].tsx # Dynamic horoscope detail
│ ├── tarot.tsx # Daily tarot draw
│ └── cards.tsx # Tarot meanings + search
├── components/ # Reusable UI pieces
│ ├── StarField.tsx # Animated cosmic background
│ ├── ZodiacCard.tsx
│ ├── ZodiacIcon.tsx
│ ├── BirthDetailsModal.tsx
│ └── ui/ # Button, future shadcn-like components
├── hooks/ # Custom logic (VG requirement)
│ ├── useDailyHoroscope.ts
│ └── useDailyTarot.ts
├── lib/ # Utilities
│ └── birthDetailsStorage.ts # AsyncStorage + zodiac inference
├── data/ # Static data
│ └── Zodiacs.ts
├── types/ # Shared TypeScript types
│ └── index.ts
├── assets/ # Images, fonts, icons
└── README.md # This file
text## Technical Choices & Why

- **Expo Router** instead of React Navigation → file-based routing is simpler, dynamic params are built-in, meets course G/VG navigation requirements
- **NativeWind** → allows real Tailwind syntax in React Native, dark mode support, easy theme extension
- **Custom hooks** for API calls → keeps components clean (single responsibility), reusable, testable (VG level)
- **Strict TypeScript** (no `any`, typed props, typed API responses) → prevents runtime errors, makes code self-documenting
- **useMemo / useCallback** in StarField → prevents unnecessary re-renders of expensive animations
- **AsyncStorage** for birth details → simple, offline persistence, no backend needed
- **Robust error handling** → loading spinners, user-friendly error messages, empty state handling
- **Client-side search/filter** on tarot cards → meets VG requirement, fast & offline-capable

## How to Run

1. Clone or open the project
2. Install dependencies

```bash
npm install

Start development server

npx expo start --clear

iPhone: Scan QR code with Expo Go app
Web: Press w (localhost:8081)
Clear cache if issues: npx expo start -c

API Usage
Using https://freehoroscopeapi.com
Endpoints:

GET /daily?sign={sign} → daily horoscope text
GET /tarot/cards/random → random tarot card

All responses are typed with interfaces in types/index.ts.
Future Improvements (post-submission ideas)

Weekly/monthly horoscope tabs
Save favorite tarot cards
Share daily insight as image
Moon/rising sign calculation (if API expands)

Built with passion for clean code, TypeScript safety and mystical UX.
Feel free to fork or contact me for questions!
```
