import '@/global.css';
import { Platform } from 'react-native';

// JS Constants for the design system. 
// These correspond to the color tokens in global.css and tailwind.config.js.
// Use these in native styles or components that require a hex string value (like StatusBars, SVGs, etc.)
// For styling components, prefer using Tailwind CSS classes (e.g. className="bg-primary text-text")
const appColors = {
  primary: '#3B6FFF',      // app.accent
  secondary: '#22C55E',    // app.green
  background: '#F5F5F7',   // app.bg
  surface: '#ffffff',      // White
  text: '#111827',         // app.dark
  textMuted: '#9CA3AF',    // app.gray
  border: '#E5E7EB',       // Gray 200
  
  // Status colors (PRD section 6)
  disponible: '#22C55E',   // app.green
  reservado: '#F59E0B',    // app.orange
  pagado: '#EF4444',       // app.red
  cerrada: '#9CA3AF',      // app.gray
  
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',

  // Legacy / boilerplate template compatibility
  backgroundElement: '#E5E7EB',
  backgroundSelected: '#D1D5DB',
  textSecondary: '#9CA3AF',
};

export const Colors = {
  light: appColors,
  dark: appColors, // Force light-only theme in JS constants too
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
