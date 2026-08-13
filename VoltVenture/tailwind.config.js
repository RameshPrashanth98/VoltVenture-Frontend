const { DSColors } = require('./src/theme/theme');

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
