/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        bg: '#080B14',
        card: '#0D1422',
        border: 'rgba(255,255,255,0.07)',
      },
      animation: {
        'road-scroll': 'roadScroll 0.8s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.35s ease forwards',
        'count-bounce': 'countBounce 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'star-field': 'starField 60s linear infinite',
        'flame': 'flame 0.3s ease-in-out infinite alternate',
      },
      keyframes: {
        roadScroll: {
          from: { backgroundPositionX: '0px' },
          to: { backgroundPositionX: '-96px' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        countBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.25)' },
        },
        starField: {
          from: { backgroundPositionY: '0px' },
          to: { backgroundPositionY: '800px' },
        },
        flame: {
          from: { transform: 'scaleY(0.8) scaleX(1.1)' },
          to: { transform: 'scaleY(1.2) scaleX(0.9)' },
        },
      },
    },
  },
  plugins: [],
}
