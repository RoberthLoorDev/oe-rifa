/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/constants/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        textMuted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        
        // Raffle specific colors (PRD section 6)
        disponible: 'rgb(var(--color-disponible) / <alpha-value>)',
        reservado: 'rgb(var(--color-reservado) / <alpha-value>)',
        pagado: 'rgb(var(--color-pagado) / <alpha-value>)',
        cerrada: 'rgb(var(--color-cerrada) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
