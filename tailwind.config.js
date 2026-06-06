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
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        // App specific palette
        app: {
          bg: '#F5F5F7',
          accent: '#3B6FFF',
          accentHover: '#2A52BE',
          green: '#059669',
          greenLight: '#DCFCE7',
          greenBorder: '#A7F3D0',
          orange: '#EA580C',
          orangeLight: '#FFEDD5',
          orangeBorder: '#FED7AA',
          red: '#DC2626',
          redLight: '#FEE2E2',
          redBorder: '#FCA5A5',
          gray: '#9CA3AF',
          grayLight: '#F9FAFB',
          grayBorder: '#E5E7EB',
          dark: '#111827'
        },
        // Semantic aliases
        primary: '#3B6FFF',
        secondary: '#22C55E',
        background: '#F5F5F7',
        surface: '#ffffff',
        text: '#111827',
        textMuted: '#9CA3AF',
        border: '#E5E7EB', // Slate / Gray 200
        
        disponible: '#22C55E',
        reservado: '#F59E0B',
        pagado: '#EF4444',
        cerrada: '#9CA3AF',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'sheet': '0 -10px 40px -10px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
};
