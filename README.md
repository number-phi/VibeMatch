# VibeMatch

A mobile-first web app that helps groups make decisions together with a Tinder-style card-swiping UI. Create a deck, share the link, everyone swipes, and VibeMatch shows what the whole group agrees on.

## Features

- **Room & deck builder** – create a voting session with custom cards (title, short description, category, optional image URL). Each room gets a unique code like `abc-123-xyz`.
- **Swipe voting** – swipe right for YES, left for NO, with a live green/red badge while dragging. ❌ / ❤️ buttons are available for mouse and keyboard users, plus a "Card 3 of 10" progress indicator.
- **Shared link** – anyone opening the room link enters their name; votes are tracked per participant and per card.
- **Results** – shows only the cards every participant voted YES on. If there is no unanimous match yet, the top options by YES votes are shown. Results update live.
- **Dark mode by default**, responsive layout.

## Tech stack

React 19 · Vite · TypeScript · Tailwind CSS · Framer Motion · React Router · Vitest

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run preview  # preview the production build
npm test         # run unit tests
```

## Project structure

```
src/
  components/   SwipeCard, SwipeDeck, ResultsView
  pages/        Home (deck builder), RoomPage (join, swipe, results)
  lib/
    api.ts          simulated room API (localStorage)
    consensus.ts    pure match/ranking calculation (unit tested)
    useRoomState.ts hook that subscribes to room changes
  types.ts      shared types
```

## How persistence works

Rooms are stored in the browser's `localStorage` through a small API layer in `src/lib/api.ts`. The "Share" button copies a link that embeds the deck in the URL, so another device can open the room and see the cards. Votes, however, are only synced between tabs of the same browser.

To enable real multi-device voting, replace the bodies of `getRoom`, `createRoom`, `joinRoom`, `castVote` and `subscribe` in `src/lib/api.ts` with Supabase or Firebase calls (e.g. realtime subscriptions); the UI does not need to change.
