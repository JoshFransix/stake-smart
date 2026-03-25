# Stake Smart

Interactive bet slip simulator for exploring risk/reward tradeoffs when combining bets.

## Setup

```bash
npm install
cp .env.example .env  # Add your API key from the-odds-api.com
npm run dev
```

Environment variables (required):
- `VITE_ODDS_API_KEY` - API key from [The Odds API](https://the-odds-api.com/)
- `VITE_ODDS_API_BASE_URL` - API base URL (defaults to v4)

For Vercel deployment: Add these in project settings → Environment Variables.

## Stack

NX monorepo with React, TypeScript, Tailwind. Using Vite for fast dev/build.

```
apps/web          > main app
libs/ui           > shared components  
libs/betting      > calculation logic
libs/hooks        > custom hooks
libs/types        > types
libs/api          > external API client
```
