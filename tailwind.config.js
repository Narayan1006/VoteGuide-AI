/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#e8edf5',
          100: '#c5d1e6',
          200: '#9fb2d4',
          300: '#7993c2',
          400: '#5c7ab5',
          500: '#3f61a8',
          600: '#2e4f8e',
          700: '#1e3a72',
          800: '#162d5c',
          900: '#0F1B2D',
          950: '#080e18',
        },
        saffron: {
          50:  '#fff4e6',
          100: '#ffe3bf',
          200: '#ffd094',
          300: '#ffbd69',
          400: '#ffae48',
          500: '#FF6B00',
          600: '#e66000',
          700: '#cc5500',
          800: '#b34a00',
          900: '#993f00',
        },
        india: {
          saffron: '#FF9933',
          white:   '#FFFFFF',
          green:   '#138808',
          blue:    '#000080',
        },
      },
      fontFamily: {
        sans: ['Noto Sans', 'system-ui', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'Noto Sans', 'sans-serif'],
      },
      animation: {
        'fade-in':      'fadeIn 0.3s ease-in-out',
        'slide-up':     'slideUp 0.4s ease-out',
        'slide-in':     'slideIn 0.3s ease-out',
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow':  'bounce 2s infinite',
        'typing':       'typing 1.4s steps(3, end) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        typing: {
          '0%':   { opacity: '0.2' },
          '20%':  { opacity: '1' },
          '100%': { opacity: '0.2' },
        },
      },
      boxShadow: {
        'glow-saffron': '0 0 20px rgba(255, 107, 0, 0.3)',
        'glow-navy':    '0 0 20px rgba(15, 27, 45, 0.5)',
        'card':         '0 4px 24px rgba(0, 0, 0, 0.12)',
        'card-hover':   '0 8px 40px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-saffron': 'linear-gradient(135deg, #FF9933 0%, #FF6B00 100%)',
        'gradient-navy':    'linear-gradient(135deg, #0F1B2D 0%, #1e3a72 100%)',
        'gradient-tricolor':'linear-gradient(180deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
      },
    },
  },
  plugins: [],
}
