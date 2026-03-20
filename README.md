# Cosmic – Daily Horoscope & Tarot Insights

A mystical mobile app built with **React Native**, **Expo**, **TypeScript**, and **NativeWind** (Tailwind CSS for React Native).  
Fetches real-time daily horoscopes and tarot cards from the public [freehoroscopeapi.com](https://freehoroscopeapi.com) API.

**App name:** Cosmic  
**Target platforms:** iOS (tested via Expo Go) & web (localhost development)  
**Course:** App development  
**Goal:** Clean code, strong TypeScript usage, custom hooks, robust error handling, dynamic routing, client-side filtering, DRY principles

## Screenshots


- Home screen
  
  <img width="150" height="500" alt="image" src="https://github.com/user-attachments/assets/82004168-9442-4c70-bcca-e7b06cbf90f1" />
  
  <img width="150" height="500" alt="image" src="https://github.com/user-attachments/assets/2e190c73-0f45-4f97-b32b-41a5b857b6ac" />


- Zodiac detail screen
  <img width="150" height="500" alt="image" src="https://github.com/user-attachments/assets/0d508a42-8b16-4c93-8a92-6920886d0490" />
- Birth detail modal
  <img width="150" height="500" alt="image" src="https://github.com/user-attachments/assets/96dff25d-9059-4995-9ca3-fcd9f7bb067f" />
  
- Daily Horoscope
  <img width="150" height="500" alt="image" src="https://github.com/user-attachments/assets/5c226a8e-f247-4ad2-bb9e-a7b1cfc54773" />
- Todays Tarot
  <img width="150" height="500" alt="image" src="https://github.com/user-attachments/assets/f4c8233b-f940-46d4-8aeb-89ee4c047cc5" />

  
- Tarot card meanings with search/filter
  <img width="150" height="500" alt="image" src="https://github.com/user-attachments/assets/42f28478-1036-44b5-9265-0ef3263c5e1d" />

  


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



---

Built with passion for clean code, TypeScript safety, and mystical UX.  
Feel free to fork or contact for questions!
