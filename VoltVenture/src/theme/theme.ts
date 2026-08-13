import { MD3LightTheme } from 'react-native-paper';

// ─── DS Color Tokens ──────────────────────────────────────────────────────────
// Sourced from VoltVenture Design System Foundations v0.1
// https://volt-venture-design-system.vercel.app/
//
// KEY CONTRAST RULE: Electric Green (#C6FF2D) is a LIGHT colour (1.36:1 on white).
// Green is always a BACKGROUND, never a text colour on light surfaces.
// Foreground on green is always #0F0F0F (Volt Black). See DS §04.

export const DSColors = {
  // Brand primary — Electric Green. Use as button/tab BG; foreground must be textOnPrimary.
  primary: '#C6FF2D',

  // Surfaces
  background: '#FFFFFF',           // color.surface.base (light)
  surface: '#FAFAFA',              // color.grey.050 — list row fill, resting state

  // Text
  textPrimary: '#0F0F0F',          // color.text.primary (Volt Black)
  textSecondary: '#808080',        // color.text.secondary (Mid Gray)

  // Text ON primary (green) background — must be black; green is a light colour
  textOnPrimary: '#0F0F0F',        // color.action.primary.fg

  // Accessible green text on white — green.700 (4.6:1, passes AA)
  accent: '#7D9220',               // color.text.accent (light surface)

  // Borders
  border: '#EBEBEB',               // color.border.subtle (light)

  // Status colours — NOT YET DEFINED in VoltVenture DS v0.1
  // TODO: Replace with brand-approved values once DS status colours are confirmed.
  // The DS notes: "A ride-hailing product needs at least a destructive red
  // (cancel ride, payment failed). This needs a brand decision."
  error: '#D32F2F',                // TODO: replace with DS-approved error red
  destructive: '#B00020',          // TODO: replace with DS-approved destructive red
};

// ─── DS Typography Tokens ─────────────────────────────────────────────────────
// DS uses TWO font families:
//   • Manjari  — Display / brand headlines, hero numerals (weights: 100, 400, 700)
//   • Inter    — Body / interface labels, buttons, captions (weights: 400, 500, 600, 700)
//
// TODO (D-12): Load fonts before any screen implementation.
//   Option A — @expo-google-fonts:
//     npm install @expo-google-fonts/manjari @expo-google-fonts/inter
//     Use useFonts({ Manjari_700Bold, Inter_400Regular, Inter_600SemiBold, Inter_700Bold })
//   Option B — Local TTF assets:
//     Place font files in assets/fonts/ and reference via useFonts in App.tsx
//
// DS type scale (size/lineHeight/weight):
//   display.xl  40/42  700  Manjari
//   display.lg  32/36  700  Manjari
//   display.md  28/32  700  Manjari
//   heading.lg  20/26  600  Inter
//   heading.md  17/24  600  Inter
//   heading.sm  15/20  600  Inter
//   body.lg     17/26  400  Inter
//   body.md     15/22  400  Inter
//   body.sm     13/18  400  Inter
//   label.md    13/16  600  Inter
//   label.sm    11/14  500  Inter
//   overline    10/14  500  Inter  (+0.12em tracking, uppercase)

export const DSTypography = {
  // TODO (D-12): Replace placeholder strings with loaded font family names.
  fontDisplay: 'Manjari',  // Display / brand — Manjari 700
  fontBody: 'Inter',       // Body / interface — Inter 400/500/600/700

  // Type scale — explicit dp values (NativeWind v4 rem = 14dp; use these directly)
  display: { fontSize: 32, lineHeight: 36, fontWeight: '700' as const },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '600' as const },
  headingMd: { fontSize: 17, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  label: { fontSize: 13, lineHeight: 16, fontWeight: '600' as const },
};

// ─── React Native Paper MD3 Theme ────────────────────────────────────────────
// Extends MD3LightTheme with DS color tokens.
// PaperProvider consumes this at app root (App.tsx).

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: DSColors.primary,
    background: DSColors.background,
    surface: DSColors.surface,
    error: DSColors.error,
    onPrimary: DSColors.textOnPrimary,      // text/icon on green button
    onBackground: DSColors.textPrimary,
    onSurface: DSColors.textPrimary,
    outline: DSColors.border,
    secondary: DSColors.accent,
    onSecondary: DSColors.background,
  },
};
