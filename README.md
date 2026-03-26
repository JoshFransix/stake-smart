# Stake Smart

**A Probabilistic Decision Support System for Multi-Bet Analysis**

Live demo: [stake-smart.vercel.app](https://stake-smart.vercel.app)  
Repository: [github.com/yourusername/stake-smart](https://github.com/yourusername/stake-smart)

---

## Overview

Stake Smart is an innovative React application that helps users understand the **combined risk** of multiple betting selections through real-time probability modeling and scenario simulation. Unlike traditional bet calculators that only show potential payouts, Stake Smart provides deep insights into how different bet combinations affect overall win probability.

### The Problem

Traditional betting platforms show individual odds and potential payouts, but fail to communicate the **exponentially decreasing probability** when combining multiple bets. Users make uninformed decisions without understanding the true risk of accumulator bets.

### The Solution

Stake Smart provides:
- **Real-time probability calculations** for individual and combined bets
- **Scenario simulation engine** for exploring what-if alternatives
- **Live sports odds integration** via The Odds API
- **Bet history analytics** with data visualization
- **Risk level assessment** with visual indicators
- **Interactive data visualization** showing probability distributions

---

## Key Features

### 1. 🎯 Scenario Explorer (Innovation Showcase)

The **Scenario Explorer** is the core innovation - a dynamic simulation engine that generates alternative bet combinations in real-time:

- Automatically generates 5 scenario variations based on your current selections
- Shows how changing one bet affects overall probability and payout
- Interactive comparison view with animated transitions
- Helps users find optimal risk/reward balance

**Technical Implementation:**
- Custom `useScenarios` hook with memoization for performance
- Pure functional calculation engine for consistent results
- Staggered animations with Framer Motion for visual hierarchy
- Real-time recalculation on any bet change

### 2. 📊 Bet History Visualization (Innovation Feature)

Comprehensive analytics dashboard with Chart.js integration:
- **Win rate over time** line chart showing cumulative success rate
- **Win rate by odds range** bar chart (1-2x, 2-5x, 5-10x, 10x+)
- **Risk vs reward scatter plot** showing relationship between odds and returns
- **Summary statistics**: Win rate percentage, total staked, total returns, net profit
- **Recent bets list** with detailed breakdown
- **Zustand state management** with automatic persistence

**Technical Implementation:**
- Zustand stores with persist middleware for localStorage integration
- Chart.js with React wrappers (react-chartjs-2)
- Real-time chart updates on bet completion
- Color-coded visualizations (green = won, red = lost)

### 3. 📈 Probability Analysis Engine

Advanced mathematical modeling showing:
- **Implied probability** from decimal odds (1/odds × 100)
- **Combined probability** for accumulator bets (product of individual probabilities)
- **Win chance indicators** (Very Low → Very High)
- Animated progress bars with color-coded risk levels

### 4. 🔴 Live Odds Integration

Real-time sports data via The Odds API:
- Live matches across multiple sports (EPL, La Liga, NBA, NFL)
- Dynamic odds updates
- One-click bet addition with duplicate detection
- Error handling with graceful fallbacks

### 5. 🎨 Advanced UI/UX

Production-ready interface with:
- **Dark mode** with system preference detection
- **Framer Motion animations** with spring physics
- **Mobile-responsive design** with collapsible frosted glass panel
- **Toast notifications** for user feedback
- **Currency localization** (Nigerian Naira with Intl.NumberFormat)

---

## Technical Architecture

### NX Monorepo Structure

```
stake-smart/
├── apps/
│   └── web/                 # Main React application (Vite)
└── libs/
    ├── types/               # TypeScript interfaces and types
    ├── betting/             # Pure calculation logic
    │   ├── index.ts         # calculateSummary, calculateRiskLevel
    │   ├── probability.ts   # Probability calculations
    │   └── formatters.ts    # Currency and odds formatting
    ├── hooks/               # Custom React hooks
    │   ├── useBetSlip.ts    # Core bet management logic
    │   ├── useDarkMode.ts   # Theme persistence
    │   ├── useScenarios.ts  # Scenario generation engine
    │   ├── useLiveMatches.ts # Live odds fetching
    │   └── stores/          # Zustand state stores
    │       ├── betHistoryStore.ts  # Bet history with persistence
    │       └── themeStore.ts       # Theme management
    ├── ui/                  # Reusable components (13 components)
    │   ├── BetCard.tsx      # Animated bet selection card
    │   ├── BetHistory.tsx   # Analytics dashboard with Chart.js
    │   ├── ProbabilityAnalyzer.tsx
    │   ├── ScenarioExplorer.tsx
    │   └── ... 9 more components
    └── api/                 # External API integration
        ├── odds-api.ts      # The Odds API client (Axios)
        └── types.ts         # API response types
```

### Why NX Monorepo?

- **Code sharing**: Libraries imported via path aliases (`@stake-smart/ui`)
- **Type safety**: Shared TypeScript types across all packages
- **Build optimization**: Only rebuild changed packages
- **Scalability**: Easy to add new apps or libraries
- **Developer experience**: Consistent tooling and commands

### Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | React 18.3 | UI rendering and component composition |
| Language | TypeScript 5.6 | Type safety, strict mode enabled |
| Build Tool | Vite 5.4 | Fast HMR, optimized production builds |
| Monorepo | NX 22.0 | Workspace management, path aliases |
| State Management | Zustand 4.x | Simple state management with persistence |
| Styling | Tailwind CSS 3.4 | Utility-first CSS, dark mode support |
| Animation | Framer Motion 11.0 | Spring physics, layout animations |
| Data Visualization | Chart.js 4.x | Interactive charts and analytics |
| HTTP Client | Axios 1.13.6 | API requests with interceptors |
| API | The Odds API | Live sports odds data (500 req/month free) |

---

## Technical Challenges & Solutions

### Challenge 1: Complex State Management for Scenario Generation

**Problem:** Generating 5 alternative scenarios for each bet change required expensive recalculations.

**Solution:**
- Implemented `useScenarios` hook with React.useMemo for intelligent caching
- Separated scenario generation logic into pure functions for testability
- Used staggered animations to hide calculation time (perceived performance)

```typescript
const scenarios = useMemo(() => 
  generateScenarios(bets, stake), 
  [bets, stake]
);
```

### Challenge 2: Real-time API Integration with Rate Limiting

**Problem:** The Odds API has 500 requests/month limit, need to avoid hitting limits during development.

**Solution:**
- Created custom Axios client with base URL and API key injection
- Implemented error handling with user-friendly fallback messages
- Added sport filtering to reduce unnecessary API calls
- Used React Query pattern (custom hook) for data fetching

### Challenge 3: Floating Point Precision in Probability Calculations

**Problem:** JavaScript's floating point arithmetic caused incorrect probability calculations (e.g., 0.1 + 0.2 = 0.30000000000000004).

**Solution:**
- Implemented calculation functions with proper rounding
- Used `.toFixed(2)` for display while keeping full precision in calculations
- Created pure functions for all mathematical operations (easy to test)

### Challenge 4: Mobile UX for Multi-Section Layout

**Problem:** Desktop layout with bet slip, summary, and analysis panels didn't fit mobile screens.

**Solution:**
- Created collapsible mobile panel with frosted glass effect
- Used AnimatePresence for smooth expand/collapse transitions
- Added floating "scroll to top" button for long bet lists
- Responsive design: hidden on desktop, replaces sticky sidebar on mobile

### Challenge 5: Duplicate Bet Detection

**Problem:** Users could accidentally add the same match multiple times.

**Solution:**
- Added validation in `addBet` function checking match names
- Return false on duplicate detection (no state mutation)
- Show error toast with clear message
- Maintains data integrity without complex deduplication logic

---

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm 9+
- The Odds API key (free tier: [the-odds-api.com](https://the-odds-api.com/))

### Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/stake-smart.git
cd stake-smart

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your VITE_ODDS_API_KEY

# Start development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_ODDS_API_KEY=your_api_key_here
VITE_ODDS_API_BASE_URL=https://api.the-odds-api.com/v4
```

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Output: dist/apps/web/
```

---

## Deployment

### Vercel Deployment (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_ODDS_API_KEY`
   - `VITE_ODDS_API_BASE_URL`
4. Deploy

**vercel.json** configuration:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/apps/web",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Other Platforms

The app is a static SPA and can be deployed to:
- Netlify
- Cloudflare Pages
- GitHub Pages
- AWS S3 + CloudFront

---

## Usage Guide

### Adding Bets

1. **From Live Matches**: Click any odds button in the "Live Matches" section
2. Toggle bets on/off with the checkbox
3. Remove bets with the "Remove" button

### Understanding Probability

- **Implied Probability**: Chance of a single bet winning (1/odds × 100)
- **Combined Probability**: Chance of ALL selected bets winning together
- **Risk Level**: Color-coded indicator (Green = Low Risk, Red = High Risk)

### Using Scenario Explorer

1. Add at least 2 bets to your slip
2. Enter a stake amount
3. Scroll to "Scenario Explorer"
4. View 5 alternative scenarios with different bet combinations
5. Compare probabilities and potential payouts

---

## Project Structure Explained

### Separation of Concerns

**libs/types** - Single source of truth for data shapes
```typescript
export interface Bet {
  id: string;
  match: string;
  odds: number;
  selected: boolean;
}
```

**libs/betting** - Pure calculation logic (no React dependencies)
```typescript
export function calculateSummary(bets: Bet[], stake: number): BetSlipSummary {
  // Pure function - same input always gives same output
}
```

**libs/hooks** - React-specific logic
```typescript
export function useBetSlip() {
  // Manages bet state, provides actions
  // Uses libs/betting for calculations
}
```

**libs/ui** - Presentational components
```typescript
export function BetCard({ bet, onToggle, onRemove }) {
  // Only renders UI, no business logic
}
```

### Path Aliases

Configured in `tsconfig.base.json` and `vite.config.ts`:

```typescript
import { BetCard } from '@stake-smart/ui';
import { calculateSummary } from '@stake-smart/betting';
import type { Bet } from '@stake-smart/types';
```

Cleaner than relative imports:
```typescript
// ❌ Bad
import { BetCard } from '../../../../libs/ui/src/BetCard';

// ✅ Good
import { BetCard } from '@stake-smart/ui';
```

---

## API Integration

### The Odds API

**Endpoints Used:**
- `GET /v4/sports/{sport}/odds/` - Fetch live odds for a sport
- Query params: `regions=uk,us`, `markets=h2h`, `oddsFormat=decimal`

**Rate Limits:**
- Free tier: 500 requests/month
- Pro tier: 10,000 requests/month

**Data Transformation:**
```typescript
// API response (verbose)
{
  id: "abc123",
  home_team: "Manchester United",
  away_team: "Liverpool",
  bookmakers: [{ markets: [{ outcomes: [...] }] }]
}

// Transformed (clean)
{
  id: "abc123",
  home: "Manchester United",
  away: "Liverpool",
  odds: { home: 2.5, away: 2.8, draw: 3.2 }
}
```

---

## Performance Optimizations

1. **Memoization**: `useMemo` for expensive scenario calculations
2. **Code splitting**: Lazy loading with React.lazy (if implemented)
3. **Tree shaking**: Vite removes unused code from production bundle
4. **Asset optimization**: Images compressed, fonts optimized
5. **Animation performance**: GPU-accelerated transforms (`translateX` not `left`)

---

## Testing Strategy

While tests aren't implemented yet, the architecture supports:

**Unit Tests:**
- `libs/betting` functions (pure, easy to test)
- Probability calculations with known inputs/outputs

**Integration Tests:**
- Custom hooks with React Testing Library
- Mock API responses for useLiveMatches

**E2E Tests:**
- Add bet flow
- Scenario generation
- Dark mode toggle

---

## Future Enhancements

- [ ] Export bet slips as PDF or image
- [ ] Shareable bet slip links (URL encoding)
- [ ] More sports (Tennis, Cricket, etc.)
- [ ] Bookmaker comparison (find best odds)
- [ ] Push notifications for live odds changes
- [ ] Multi-language support (i18n)
- [ ] Accessibility improvements (keyboard navigation, screen readers)

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires ES2015+ support and CSS Grid.

---

## License

MIT License - see LICENSE file for details

---

## Contact & Support

**Developer**: [Your Name]  
**Email**: your.email@example.com  
**GitHub**: [@yourusername](https://github.com/yourusername)  
**Portfolio**: [yourportfolio.com](https://yourportfolio.com)

---

## Acknowledgments

- **The Odds API** - Live sports data provider
- **Framer Motion** - Animation library
- **NX** - Monorepo tooling
- **Vercel** - Deployment platform

---

**Built for:** Technical Assessment - Innovative Feature Implementation  
**Timeline:** 48 hours  
**Date:** March 27, 2026
