# Cosmic – Daily Horoscope & Tarot Insights

A mystical mobile app built with **React Native**, **Expo**, **TypeScript**, and **NativeWind** (Tailwind CSS for React Native).  
Fetches real-time daily horoscopes and tarot cards from the public [freehoroscopeapi.com](https://freehoroscopeapi.com) API.

**App name:** Cosmic  
**Target platforms:** iOS (tested via Expo Go) & web (localhost development)  
**Course:** App development  
**Goal:** Clean code, strong TypeScript usage, custom hooks, robust error handling, dynamic routing, client-side filtering, DRY principles

## Screenshots

(Add screenshots later – use Figma frames or Expo snapshots)

- Home screen – Zodiac selection
- Horoscope detail screen (dynamic route)
- Today's Tarot draw
- Tarot card meanings with search/filter
- Birth details modal

## Features

- **12 zodiac signs** with themed cards and element styling
- **Daily horoscope** fetched from API (personalized per sign)
- **Today's random tarot card** (pull fresh card on demand)
- **Tarot card database** with full meanings + client-side search/filter
- **Birth details modal** – saves name/date/place → infers zodiac sign
- Animated **StarField** cosmic background (performance-optimized with useMemo + native animations)
- Comprehensive **loading & error states** for all API calls
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


## Technical Choices & Rationale

- **Expo Router**: File-based routing is simpler, dynamic params are built-in, meets course navigation requirements
- **NativeWind**: Enables Tailwind syntax in React Native, dark mode support, easy theme extension
- **Custom hooks**: Keeps components clean (single responsibility), reusable, testable (VG level)
- **Strict TypeScript**: No `any`, typed props, typed API responses; prevents runtime errors, self-documenting code
- **useMemo / useCallback**: Optimizes StarField animation performance
- **AsyncStorage**: Simple offline persistence for birth details, no backend needed
- **Robust error handling**: Loading spinners, user-friendly error messages, empty state handling
- **Client-side search/filter**: Fast & offline-capable tarot card search (VG requirement)

## How to Run

1. Clone or open the project
2. Install dependencies

```bash
npm install
```

1. Start development server

```bash
npx expo start --clear
```

- iPhone: Scan QR code with Expo Go app  
- Web: Press `w` (localhost:8081)  
- Clear cache if issues: `npx expo start -c`

### API Usage

Using [freehoroscopeapi.com](https://freehoroscopeapi.com)  
Endpoints:

- `GET /daily?sign={sign}` → daily horoscope text
- `GET /tarot/cards/random` → random tarot card

All responses are typed with interfaces in `types/index.ts`.

## Future Improvements

- Weekly/monthly horoscope tabs
- Save favorite tarot cards
- Share daily insight as image
- Moon/rising sign calculation (if API expands)

---

Built with passion for clean code, TypeScript safety, and mystical UX.  
Feel free to fork or contact for questions!
