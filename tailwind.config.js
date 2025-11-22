/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom colors for weather conditions
      colors: {
        weather: {
          // Clear/Sunny
          clear: {
            light: '#FEF3C7',
            DEFAULT: '#F59E0B',
            dark: '#B45309',
          },
          // Cloudy
          cloudy: {
            light: '#E5E7EB',
            DEFAULT: '#6B7280',
            dark: '#374151',
          },
          // Rainy
          rain: {
            light: '#DBEAFE',
            DEFAULT: '#3B82F6',
            dark: '#1D4ED8',
          },
          // Cold
          cold: {
            light: '#CFFAFE',
            DEFAULT: '#06B6D4',
            dark: '#0891B2',
          },
          // Hot
          hot: {
            light: '#FEE2E2',
            DEFAULT: '#EF4444',
            dark: '#DC2626',
          },
        },
        // Activity quality colors
        activity: {
          perfect: '#10B981', // Green
          good: '#3B82F6',    // Blue
          fair: '#F59E0B',    // Amber
          skip: '#6B7280',    // Gray
        },
      },
      
      // Custom fonts (you'll add your Figma fonts here)
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      // Custom animations for swipeable cards
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      
      // Custom spacing for card layouts
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      
      // Border radius for cards
      borderRadius: {
        'card': '1.5rem',
        'card-lg': '2rem',
      },
      
      // Box shadows for glassmorphism
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'card': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.15)',
      },
      
      // Backdrop blur for glass effect
      backdropBlur: {
        'glass': '4px',
      },
    },
  },
  plugins: [],
};
