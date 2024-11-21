import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sparkle': 'sparkle 2s linear infinite',
        'legendary-border': 'legendary-border 4s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-faster': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fastest': 'pulse 0.75s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        legendary: 'legendary 2s ease-in-out infinite',
        epic: 'epic 2s ease-in-out infinite',
        rare: 'rare 2s ease-in-out infinite',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'legendary-border': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        legendary: {
          '0%, 100%': {
            'box-shadow': '0 0 50px -5px rgba(255,215,0,0.7)',
          },
          '50%': {
            'box-shadow': '0 0 70px 5px rgba(255,215,0,0.9)',
          },
        },
        epic: {
          '0%, 100%': {
            'box-shadow': '0 0 40px -5px rgba(147,51,234,0.7)',
          },
          '50%': {
            'box-shadow': '0 0 60px 5px rgba(147,51,234,0.9)',
          },
        },
        rare: {
          '0%, 100%': {
            'box-shadow': '0 0 30px -5px rgba(59,130,246,0.7)',
          },
          '50%': {
            'box-shadow': '0 0 50px 5px rgba(59,130,246,0.9)',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-orbitron)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
