import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        paper: '#f8fafc',
        accent: '#0f766e'
      },
      boxShadow: {
        soft: '0 20px 50px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
} satisfies Config;