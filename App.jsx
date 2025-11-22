/**
 * Tiny Weather - Example App
 * 
 * This example shows how to wire up your Figma designs with the Tiny Weather brains.
 * Replace the example components with your own Figma-designed components.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTinyWeather, useSwipeGesture, useTemperatureFormatter } from './index.js';

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  const {
    weather,
    outfits,
    activities,
    tips,
    children,
    addChild,
    removeChild,
    isLoading,
    error,
    refresh,
    lastUpdated,
  } = useTinyWeather({
    apiKey: import.meta.env.VITE_WEATHER_API_KEY,
    useMockData: true, // Set to false when you have an API key
  });

  // Show onboarding if no children added
  const [showOnboarding, setShowOnboarding] = useState(children.length === 0);

  if (showOnboarding || children.length === 0) {
    return (
      <OnboardingScreen 
        onComplete={() => setShowOnboarding(false)}
        addChild={addChild}
      />
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={refresh} />;
  }

  return (
    <SwipeableCardStack>
      <HeroCard weather={weather} />
      <VibeCard weather={weather} />
      {outfits.map(outfit => (
        <OutfitCard key={outfit.childId} outfit={outfit} />
      ))}
      <TimelineCard activities={activities} />
      <TipsCard tips={tips} />
      <SummaryCard 
        weather={weather} 
        activities={activities} 
        lastUpdated={lastUpdated}
        onRefresh={refresh}
      />
    </SwipeableCardStack>
  );
}

// ============================================================================
// SWIPEABLE CARD STACK
// ============================================================================

function SwipeableCardStack({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cards = Array.isArray(children) ? children.filter(Boolean) : [children];

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
      className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400"
      {...swipeHandlers}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="h-full w-full flex items-center justify-center p-4"
        >
          {cards[currentIndex]}
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex 
                ? 'bg-white w-6' 
                : 'bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Swipe hint */}
      {currentIndex < cards.length - 1 && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-sm"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ↑ Swipe up
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// CARD COMPONENTS (Replace with your Figma designs)
// ============================================================================

function CardWrapper({ children, className = '' }) {
  return (
    <div className={`
      w-full max-w-md bg-white/20 backdrop-blur-xl rounded-3xl p-8
      text-white shadow-xl ${className}
    `}>
      {children}
    </div>
  );
}

function HeroCard({ weather }) {
  const { format } = useTemperatureFormatter();
  const { current, daily } = weather;
  const today = daily?.[0];

  return (
    <CardWrapper className="text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-white/70 mb-2"
      >
        Right now
      </motion.p>
      
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="text-8xl font-bold mb-4"
      >
        {current.temperature}°
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl mb-2"
      >
        {current.conditionText}
      </motion.p>
      
      {today && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/70"
        >
          {today.tempLow}° / {today.tempHigh}°
        </motion.p>
      )}
    </CardWrapper>
  );
}

function VibeCard({ weather }) {
  const getVibe = () => {
    const temp = weather.current.temperature;
    const rain = weather.current.precipitationProbability;
    
    if (rain > 60) return { emoji: '🌧️', text: 'Cozy Indoor Day', sub: 'Rainy vibes' };
    if (temp > 85) return { emoji: '🔥', text: 'Hot Hot Hot', sub: 'Stay cool!' };
    if (temp > 75) return { emoji: '☀️', text: 'Perfect Beach Day', sub: 'Soak it up' };
    if (temp > 65) return { emoji: '🌤️', text: 'Perfect Playground Weather', sub: 'Get outside!' };
    if (temp > 50) return { emoji: '🍂', text: 'Sweater Weather', sub: 'Crisp and cozy' };
    return { emoji: '❄️', text: 'Bundle Up Day', sub: 'Stay warm!' };
  };

  const vibe = getVibe();

  return (
    <CardWrapper className="text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className="text-9xl mb-6"
      >
        {vibe.emoji}
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold mb-2"
      >
        {vibe.text}
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/70"
      >
        {vibe.sub}
      </motion.p>
    </CardWrapper>
  );
}

function OutfitCard({ outfit }) {
  return (
    <CardWrapper>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-2xl">
          👶
        </div>
        <div>
          <h2 className="text-2xl font-bold">{outfit.childName}</h2>
          <p className="text-white/70 capitalize">{outfit.ageGroup}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-white/70 text-sm mb-1">Today's range</p>
        <p className="text-xl">
          {outfit.morningTemp}° → {outfit.afternoonTemp}°
          {outfit.tempSwing >= 15 && (
            <span className="text-sm text-white/70 ml-2">
              ({outfit.tempSwing}° swing)
            </span>
          )}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {outfit.items.filter(i => i.required).map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 bg-white/10 rounded-xl p-3"
          >
            <span className="text-2xl">{item.emoji}</span>
            <div>
              <p className="font-medium">{item.name}</p>
              {item.reason && (
                <p className="text-sm text-white/60">{item.reason}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {outfit.tips.length > 0 && (
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-sm">💡 {outfit.tips[0]}</p>
        </div>
      )}
    </CardWrapper>
  );
}

function TimelineCard({ activities }) {
  if (!activities) return null;

  const qualityColors = {
    perfect: 'bg-green-400',
    good: 'bg-blue-400',
    fair: 'bg-amber-400',
    skip: 'bg-gray-400',
  };

  return (
    <CardWrapper>
      <h2 className="text-2xl font-bold mb-2">Activity Windows</h2>
      <p className="text-white/70 mb-6">{activities.daySummary}</p>

      {activities.bestWindow && (
        <div className="bg-green-500/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-white/70">✨ Best time</p>
          <p className="text-xl font-bold">{activities.bestWindow.label}</p>
          <p className="text-sm">{activities.bestWindow.description}</p>
        </div>
      )}

      <div className="flex gap-1 overflow-x-auto pb-2">
        {activities.hours.slice(0, 12).map((hour, i) => (
          <div key={i} className="flex flex-col items-center min-w-[3rem]">
            <span className="text-xs text-white/60 mb-1">
              {hour.time.getHours() % 12 || 12}
              {hour.time.getHours() >= 12 ? 'p' : 'a'}
            </span>
            <div className={`w-8 h-16 rounded-lg ${qualityColors[hour.quality]} flex items-center justify-center`}>
              <span className="text-xs">{hour.emoji}</span>
            </div>
            <span className="text-xs mt-1">{hour.temperature}°</span>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}

function TipsCard({ tips }) {
  if (!tips || tips.tips.length === 0) return null;

  const priorityColors = {
    high: 'border-l-4 border-red-400 bg-red-500/20',
    medium: 'border-l-4 border-amber-400 bg-amber-500/20',
    low: 'border-l-4 border-blue-400 bg-blue-500/20',
  };

  return (
    <CardWrapper>
      <h2 className="text-2xl font-bold mb-6">Smart Tips</h2>

      <div className="space-y-4">
        {tips.tips.slice(0, 4).map((tip) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 ${priorityColors[tip.priority]}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tip.emoji}</span>
              <div>
                <p className="font-medium">{tip.title}</p>
                <p className="text-sm text-white/70">{tip.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </CardWrapper>
  );
}

function SummaryCard({ weather, activities, lastUpdated, onRefresh }) {
  return (
    <CardWrapper className="text-center">
      <h2 className="text-2xl font-bold mb-4">Today's Summary</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-3xl mb-1">{weather.current.temperature}°</p>
          <p className="text-sm text-white/60">Now</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-3xl mb-1">{weather.daily?.[0]?.tempHigh}°</p>
          <p className="text-sm text-white/60">High</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-3xl mb-1">{weather.current.precipitationProbability}%</p>
          <p className="text-sm text-white/60">Rain</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-3xl mb-1">{weather.current.uvIndex}</p>
          <p className="text-sm text-white/60">UV</p>
        </div>
      </div>

      {activities?.bestWindow && (
        <p className="text-white/70 mb-6">
          Best outdoor time: <strong>{activities.bestWindow.label}</strong>
        </p>
      )}

      <button
        onClick={onRefresh}
        className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full transition-colors"
      >
        Refresh
      </button>

      {lastUpdated && (
        <p className="text-xs text-white/40 mt-4">
          Updated {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </CardWrapper>
  );
}

// ============================================================================
// UTILITY SCREENS
// ============================================================================

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
      />
    </div>
  );
}

function ErrorScreen({ error, onRetry }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center p-4">
      <CardWrapper className="text-center">
        <p className="text-6xl mb-4">😕</p>
        <h2 className="text-2xl font-bold mb-2">Oops!</h2>
        <p className="text-white/70 mb-6">{error.message}</p>
        <button
          onClick={onRetry}
          className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full"
        >
          Try Again
        </button>
      </CardWrapper>
    </div>
  );
}

function OnboardingScreen({ onComplete, addChild }) {
  const [name, setName] = useState('');
  const [ageMonths, setAgeMonths] = useState(24);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      addChild(name.trim(), ageMonths);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <CardWrapper>
        <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
        <p className="text-white/70 mb-8">Let's set up Tiny Weather for your family.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Child's name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="w-full bg-white/20 rounded-xl px-4 py-3 placeholder-white/40 outline-none focus:ring-2 ring-white/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Age</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="144"
                value={ageMonths}
                onChange={(e) => setAgeMonths(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-24 text-right">
                {ageMonths < 24 
                  ? `${ageMonths} months`
                  : `${Math.floor(ageMonths / 12)} years`
                }
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-purple-600 font-bold py-4 rounded-xl hover:bg-white/90 transition-colors"
          >
            Get Started
          </button>
        </form>
      </CardWrapper>
    </div>
  );
}

export default App;
