# 🌤️ Tiny Weather

**Spotify Wrapped meets Weather Forecasting for Parents**

A beautiful, swipeable weather app that tells parents exactly what their kids should wear and when to go outside. Powered by Google's WeatherNeXT 2 AI forecasting.

## Features

- **Smart Outfit Recommendations** - Age-aware clothing suggestions
- **Activity Window Calculator** - Best times for outdoor play
- **Parent-Specific Tips** - Rain timing, playground conditions, weekend planning
- **Swipeable Card UI** - Spotify Wrapped-style experience

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Add your Google Maps Weather API key

# Start development
npm run dev
```

## Architecture

```
src/
├── index.js           # Main exports
├── App.jsx            # Example app with all cards
├── hooks/
│   └── index.js       # React hooks (useTinyWeather, etc.)
├── services/
│   ├── weatherApi.js  # API fetching & caching
│   ├── outfitEngine.js # Outfit recommendations
│   ├── activityCalc.js # Activity windows
│   └── smartTips.js   # Smart tips generation
├── utils/
│   └── constants.js   # Configuration & thresholds
└── types/
    └── index.js       # JSDoc type definitions
```

## Integration with Figma Designs

The architecture cleanly separates logic from UI. See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed instructions on plugging in your Figma components.

```jsx
import { useTinyWeather } from './index.js';

function App() {
  const { weather, outfits, activities, tips, isLoading } = useTinyWeather({
    apiKey: 'YOUR_API_KEY',
    useMockData: true, // For development
  });

  return (
    <>
      <YourHeroCard weather={weather} />
      <YourOutfitCards outfits={outfits} />
      <YourTimelineCard activities={activities} />
      <YourTipsCard tips={tips} />
    </>
  );
}
```

## Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel

# Or Netlify
npx netlify deploy --prod --dir=dist
```

## API Key Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Weather API**
4. Create an API key with Weather API access
5. Add to `.env` as `VITE_WEATHER_API_KEY`

## License

MIT
