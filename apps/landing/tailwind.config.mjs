/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        app: {
          dark: '#111827',
          gray: '#9CA3AF',
          bgOuter: '#EBECE6',
          accent: '#3B6FFF',
          accentHover: '#2A52BE',
          green: '#059669',
          orange: '#EA580C',
          red: '#DC2626',
        },
      },
    },
  },
  plugins: [],
};
