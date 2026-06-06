import '@/global.css';
import { Platform } from 'react-native';

// JS Constants for the design system. 
// These correspond to the color tokens in global.css and tailwind.config.js.
// Use these in native styles or components that require a hex string value (like StatusBars, SVGs, etc.)
// For styling components, prefer using Tailwind CSS classes (e.g. className="bg-primary text-text")
export const Colors = {
  light: {
    // Brand design system
    primary: '#4f46e5',      // Indigo 600
    secondary: '#06b6d4',    // Cyan 500
    background: '#f8fafc',   // Slate 50
    surface: '#ffffff',      // White
    text: '#0f172a',         // Slate 900
    textMuted: '#64748b',    // Slate 500
    border: '#e2e8f0',       // Slate 200
    
    // Status colors (PRD section 6)
    disponible: '#10b981',   // Emerald 500 (Verde)
    reservado: '#f59e0b',    // Amber 500 (Naranja)
    pagado: '#ef4444',       // Red 500 (Rojo)
    cerrada: '#64748b',      // Slate 500 (Gris)
    
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',

    // Legacy / boilerplate template compatibility
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    // Brand design system
    primary: '#6366f1',      // Indigo 500
    secondary: '#22d3ee',    // Cyan 400
    background: '#0f172a',   // Slate 900
    surface: '#1e293b',      // Slate 800
    text: '#f8fafc',         // Slate 50
    textMuted: '#94a3b8',    // Slate 400
    border: '#334155',       // Slate 700
    
    // Status colors (PRD section 6)
    disponible: '#34d399',   // Emerald 400 (Verde)
    reservado: '#fbbf24',    // Amber 400 (Naranja)
    pagado: '#f87171',       // Red 400 (Rojo)
    cerrada: '#94a3b8',      // Slate 400 (Gris)
    
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',

    // Legacy / boilerplate template compatibility
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

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
