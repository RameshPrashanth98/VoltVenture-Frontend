// DS color tokens inlined here (source of truth: src/theme/theme.ts).
// Cannot require() theme.ts directly — it's TypeScript ESM and imports react-native-paper.
// Keep in sync with DSColors in theme.ts manually.
const DSColors = {
  primary: '#C6FF2D',
  background: '#FFFFFF',
  surface: '#FAFAFA',
  textPrimary: '#0F0F0F',
  textSecondary: '#808080',
  textOnPrimary: '#0F0F0F',
  accent: '#7D9220',
  border: '#EBEBEB',
  error: '#D32F2F',
  destructive: '#B00020',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: DSColors.primary,
        background: DSColors.background,
        surface: DSColors.surface,
        'text-primary': DSColors.textPrimary,
        'text-secondary': DSColors.textSecondary,
        'text-on-primary': DSColors.textOnPrimary,
        accent: DSColors.accent,
        error: DSColors.error,
        destructive: DSColors.destructive,
        border: DSColors.border,
      },
    },
  },
  plugins: [],
};
