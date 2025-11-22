# 🎨 Tiny Weather - Figma Integration Guide

This guide shows you exactly how to connect your Figma designs to the Tiny Weather brains.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR FIGMA DESIGNS                       │
│  (Cards, Layouts, Animations, Colors, Typography)           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      REACT HOOKS                             │
│  useTinyWeather() → weather, outfits, activities, tips      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVICES                               │
│  weatherApi.js │ outfitEngine.js │ activityCalc.js │ tips  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               GOOGLE WEATHER API (WeatherNeXT 2)            │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Install Dependencies

```bash
cd tiny-weather
npm install
```

### 2. Set Up Your API Key

Create a `.env` file:

```env
VITE_WEATHER_API_KEY=your_google_maps_weather_api_key
```

### 3. Create Your App Component

```jsx
// src/App.jsx
import { useTinyWeather } from './index.js';
import { YourHeroCard, YourOutfitCard, YourTimelineCard } from './components';

function App() {
  const {
    weather,
    outfits,
    activities,
    tips,
    children,
    addChild,
    isLoading,
    error,
  } = useTinyWeather({
    apiKey: import.meta.env.VITE_WEATHER_API_KEY,
    useMockData: import.meta.env.DEV, // Use mock data in development
  });

  if (isLoading) return <YourLoadingScreen />;
  if (error) return <YourErrorScreen error={error} />;

  return (
    <div className="app">
      <YourHeroCard weather={weather} />
      {outfits.map(outfit => (
        <YourOutfitCard key={outfit.childId} outfit={outfit} />
      ))}
      <YourTimelineCard activities={activities} />
      <YourTipsCard tips={tips} />
    </div>
  );
}
```

---

## Data Shapes Reference

Here's exactly what data you'll receive from each hook, so you can design your Figma components accordingly.

### Weather Data

```typescript
// What you get from: weather (via useTinyWeather)
{
  current: {
    temperature: 68,           // Fahrenheit
    feelsLike: 65,
    humidity: 55,              // Percentage
    windSpeed: 8,              // mph
    uvIndex: 5,
    precipitationProbability: 15,
    condition: 'PARTLY_CLOUDY',
    conditionText: 'Partly Cloudy',
    icon: 'partly_cloudy',
    observationTime: Date,
  },
  hourly: [
    {
      time: Date,
      temperature: 62,
      feelsLike: 60,
      humidity: 60,
      precipitationProbability: 10,
      uvIndex: 3,
      windSpeed: 5,
      condition: 'CLEAR',
      conditionText: 'Clear',
    },
    // ... 12 hours total
  ],
  daily: [
    {
      date: Date,
      tempHigh: 75,
      tempLow: 58,
      precipitationProbability: 20,
      condition: 'PARTLY_CLOUDY',
      conditionText: 'Partly Cloudy',
      uvIndexMax: 7,
      sunrise: '6:45 AM',
      sunset: '7:30 PM',
    },
    // ... 7 days total
  ],
  fetchedAt: Date,
  expiresAt: Date,
}
```

### Outfit Recommendations

```typescript
// What you get from: outfits (via useTinyWeather)
[
  {
    childId: 'child-123',
    childName: 'Emma',
    ageGroup: 'toddler',        // 'baby' | 'toddler' | 'preschool' | 'school-age'
    
    items: [
      {
        id: 'long-sleeve',
        name: 'Long sleeve shirt',
        layer: 'base',          // 'base' | 'mid' | 'outer' | 'accessory' | 'footwear'
        emoji: '👔',
        required: true,
        reason: 'Cool morning',
      },
      // ... more items
    ],
    
    tips: [
      'Starts 52°, warms to 72° - have layers to shed',
      'Pack backup outfit - toddlers get messy!',
    ],
    
    summary: 'Long sleeve shirt + layers for 20° swing',
    tempCategory: 'cool',       // 'cold' | 'cool' | 'comfortable' | 'warm' | 'hot'
    needsRainGear: false,
    needsSunProtection: true,
    morningTemp: 52,
    afternoonTemp: 72,
    tempSwing: 20,
  },
  // ... one per child
]
```

### Activity Windows

```typescript
// What you get from: activities (via useTinyWeather)
{
  hours: [
    {
      time: Date,
      temperature: 65,
      feelsLike: 63,
      quality: 'perfect',       // 'perfect' | 'good' | 'fair' | 'skip'
      score: 92,                // 0-100
      reason: 'Perfect conditions',
      rainChance: 5,
      uvIndex: 4,
      emoji: '✨',
    },
    // ... 12 hours
  ],
  
  windows: [
    {
      startTime: Date,
      endTime: Date,
      quality: 'perfect',
      avgScore: 88,
      avgTemp: 68,
      label: '9am - 12pm',
      description: 'Perfect for outdoor play (68°)',
    },
    // ... grouped windows
  ],
  
  bestWindow: {
    // Same structure as windows[0]
    label: '9am - 11am',
    description: 'Perfect for outdoor play (68°)',
  },
  
  daySummary: 'Great day for outdoor activities!',
  hasGoodWindows: true,
}
```

### Smart Tips

```typescript
// What you get from: tips (via useTinyWeather)
{
  tips: [
    {
      id: 'tip-123',
      type: 'warning',          // 'alert' | 'warning' | 'info' | 'tip'
      priority: 'high',         // 'high' | 'medium' | 'low'
      title: 'Rain at Pickup Time',
      message: '60% chance of rain around pickup. Keep rain gear in the car!',
      emoji: '☔',
      category: 'rain',
      actionText: 'Set reminder',  // Optional CTA
    },
    // ... more tips
  ],
  
  primaryTip: {
    // The highest priority tip (same structure)
  },
  
  alerts: [
    // Only high-priority tips
  ],
}
```

---

## Component Examples

### Hero Card

Your Figma design probably has a hero card showing current conditions. Here's how to wire it up:

```jsx
// src/components/HeroCard.jsx
import { motion } from 'framer-motion';

export function HeroCard({ weather }) {
  const { current, daily } = weather;
  const today = daily[0];
  
  return (
    <motion.div
      className="hero-card"  // Your Figma styles
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Current temp - big and bold */}
      <h1 className="temp-current">
        {current.temperature}°
      </h1>
      
      {/* High/Low */}
      <p className="temp-range">
        {today.tempLow}° / {today.tempHigh}°
      </p>
      
      {/* Condition */}
      <p className="condition">
        {current.conditionText}
      </p>
      
      {/* Feels like */}
      <p className="feels-like">
        Feels like {current.feelsLike}°
      </p>
    </motion.div>
  );
}
```

### Outfit Card

For each child's outfit recommendation:

```jsx
// src/components/OutfitCard.jsx
import { motion } from 'framer-motion';

export function OutfitCard({ outfit }) {
  // Group items by layer for organized display
  const layers = {
    base: outfit.items.filter(i => i.layer === 'base'),
    mid: outfit.items.filter(i => i.layer === 'mid'),
    outer: outfit.items.filter(i => i.layer === 'outer'),
    footwear: outfit.items.filter(i => i.layer === 'footwear'),
    accessory: outfit.items.filter(i => i.layer === 'accessory'),
  };
  
  return (
    <motion.div className="outfit-card">
      {/* Child name */}
      <h2>{outfit.childName}</h2>
      <span className="age-badge">{outfit.ageGroup}</span>
      
      {/* Temperature context */}
      <p className="temp-context">
        {outfit.morningTemp}° → {outfit.afternoonTemp}°
      </p>
      
      {/* Clothing items */}
      <div className="clothing-list">
        {outfit.items.filter(i => i.required).map((item, i) => (
          <motion.div
            key={item.id}
            className="clothing-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="emoji">{item.emoji}</span>
            <span className="name">{item.name}</span>
            {item.reason && (
              <span className="reason">{item.reason}</span>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Tips */}
      {outfit.tips.length > 0 && (
        <div className="tips">
          {outfit.tips.map((tip, i) => (
            <p key={i}>💡 {tip}</p>
          ))}
        </div>
      )}
    </motion.div>
  );
}
```

### Timeline Card

Visual hour-by-hour activity quality:

```jsx
// src/components/TimelineCard.jsx

export function TimelineCard({ activities }) {
  if (!activities) return null;
  
  const qualityColors = {
    perfect: 'bg-green-500',
    good: 'bg-blue-500',
    fair: 'bg-amber-500',
    skip: 'bg-gray-400',
  };
  
  return (
    <div className="timeline-card">
      <h2>Best Outdoor Times</h2>
      
      {/* Best window callout */}
      {activities.bestWindow && (
        <div className="best-window">
          <span>✨ Best: {activities.bestWindow.label}</span>
          <span>{activities.bestWindow.description}</span>
        </div>
      )}
      
      {/* Hour-by-hour timeline */}
      <div className="hours-grid">
        {activities.hours.map((hour, i) => (
          <div key={i} className="hour-block">
            <span className="time">
              {hour.time.toLocaleTimeString('en-US', { hour: 'numeric' })}
            </span>
            <div className={`quality-bar ${qualityColors[hour.quality]}`}>
              {hour.emoji}
            </div>
            <span className="temp">{hour.temperature}°</span>
          </div>
        ))}
      </div>
      
      {/* Day summary */}
      <p className="day-summary">{activities.daySummary}</p>
    </div>
  );
}
```

### Tips Card

Smart alerts and recommendations:

```jsx
// src/components/TipsCard.jsx

export function TipsCard({ tips }) {
  if (!tips || tips.tips.length === 0) return null;
  
  const typeStyles = {
    alert: 'bg-red-100 border-red-500',
    warning: 'bg-amber-100 border-amber-500',
    info: 'bg-blue-100 border-blue-500',
    tip: 'bg-green-100 border-green-500',
  };
  
  return (
    <div className="tips-card">
      <h2>Smart Tips</h2>
      
      {tips.tips.map((tip) => (
        <div 
          key={tip.id} 
          className={`tip ${typeStyles[tip.type]}`}
        >
          <span className="emoji">{tip.emoji}</span>
          <div className="content">
            <h3>{tip.title}</h3>
            <p>{tip.message}</p>
          </div>
          {tip.actionText && (
            <button className="action">{tip.actionText}</button>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## Swipeable Cards (Spotify Wrapped Style)

Here's how to implement the swipeable card stack:

```jsx
// src/components/SwipeableCards.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeGesture } from '../hooks';

export function SwipeableCards({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cards = Array.isArray(children) ? children : [children];
  
  const goNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  const swipeHandlers = useSwipeGesture({
    onSwipeUp: goNext,
    onSwipeDown: goPrev,
    threshold: 50,
  });
  
  return (
    <div 
      className="swipeable-container"
      {...swipeHandlers}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: 'spring', damping: 25 }}
          className="card-wrapper"
        >
          {cards[currentIndex]}
        </motion.div>
      </AnimatePresence>
      
      {/* Progress dots */}
      <div className="dots">
        {cards.map((_, i) => (
          <div 
            key={i} 
            className={`dot ${i === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      
      {/* Swipe hint */}
      {currentIndex < cards.length - 1 && (
        <motion.div
          className="swipe-hint"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          ↑ Swipe up
        </motion.div>
      )}
    </div>
  );
}
```

Usage:

```jsx
function App() {
  const { weather, outfits, activities, tips } = useTinyWeather({ ... });
  
  return (
    <SwipeableCards>
      <HeroCard weather={weather} />
      <VibeCard weather={weather} />
      {outfits.map(outfit => (
        <OutfitCard key={outfit.childId} outfit={outfit} />
      ))}
      <TimelineCard activities={activities} />
      <TipsCard tips={tips} />
      <ShareCard weather={weather} />
    </SwipeableCards>
  );
}
```

---

## Adding Children (Onboarding)

```jsx
// src/components/Onboarding.jsx
import { useState } from 'react';

export function Onboarding({ onComplete, addChild }) {
  const [name, setName] = useState('');
  const [ageMonths, setAgeMonths] = useState(24);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    addChild(name, ageMonths);
    onComplete();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Your Child</h2>
      
      <input
        type="text"
        placeholder="Child's name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      
      <label>
        Age
        <input
          type="number"
          min="0"
          max="144"
          value={ageMonths}
          onChange={(e) => setAgeMonths(Number(e.target.value))}
        />
        <span>months old</span>
      </label>
      
      <button type="submit">Add Child</button>
    </form>
  );
}
```

---

## Environment Variables

Create `.env` for development:

```env
VITE_WEATHER_API_KEY=your_api_key_here
```

For production (Vercel):

```bash
vercel env add VITE_WEATHER_API_KEY
```

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

---

## Development Tips

1. **Use Mock Data First**: Set `useMockData: true` while designing to avoid API calls
2. **Test on Mobile**: Run `npm run dev` and access via your phone on the same network
3. **Framer Motion**: All card animations work great with Framer Motion
4. **Tailwind**: The config has weather-specific colors pre-defined

---

## File Structure

```
tiny-weather/
├── src/
│   ├── index.js              # Main exports
│   ├── hooks/
│   │   └── index.js          # All React hooks
│   ├── services/
│   │   ├── weatherApi.js     # API fetching & caching
│   │   ├── outfitEngine.js   # Outfit recommendations
│   │   ├── activityCalc.js   # Activity windows
│   │   └── smartTips.js      # Smart tips generation
│   ├── utils/
│   │   └── constants.js      # Configuration & thresholds
│   ├── types/
│   │   └── index.js          # JSDoc type definitions
│   └── components/           # YOUR FIGMA COMPONENTS GO HERE
│       ├── HeroCard.jsx
│       ├── OutfitCard.jsx
│       ├── TimelineCard.jsx
│       ├── TipsCard.jsx
│       └── SwipeableCards.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── INTEGRATION_GUIDE.md      # This file
```

---

## Need Help?

The hooks handle all the complexity. Your Figma components just need to:

1. Accept the data props (weather, outfits, activities, tips)
2. Render the data beautifully
3. Handle loading and error states

That's it! The brains are built - just plug in your designs. 🎨
