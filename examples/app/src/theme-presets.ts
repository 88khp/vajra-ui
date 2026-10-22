import { createVajraTheme, TVajraColorOverrides } from 'vajra-ui';

import { manropeFonts, newsreaderFonts, plusFonts } from './fonts';

import {
  blueDark,
  blueLight,
  cosmicDark,
  cosmicLight,
  crimsonDark,
  crimsonLight,
  goldDark,
  goldLight,
  orangeDark,
  orangeLight,
  pinkDark,
  pinkLight,
  purpleDark,
  purpleLight,
  tealDark,
  tealLight,
} from './theme-presets/index';

const appFonts = {
  ...plusFonts,
  ...manropeFonts,
  ...newsreaderFonts,
};

export type TColorScheme = 'light' | 'dark';
export type TThemePreset =
  | 'teal'
  | 'purple'
  | 'orange'
  | 'blue'
  | 'pink'
  | 'gold'
  | 'crimson'
  | 'cosmic';

export const THEME_PRESET_LABELS: Record<TThemePreset, string> = {
  teal: 'Teal',
  purple: 'Purple',
  orange: 'Orange',
  blue: 'Blue',
  pink: 'Pink',
  gold: 'Gold',
  crimson: 'Crimson',
  cosmic: 'Cosmic',
};

export type TAppFonts = keyof typeof appFonts;

declare module 'vajra-ui' {
  interface IVajraFonts extends Record<TAppFonts, true> {}
}

const PRESET_COLORS: Record<TThemePreset, Record<TColorScheme, TVajraColorOverrides>> = {
  teal: { light: tealLight, dark: tealDark },
  purple: { light: purpleLight, dark: purpleDark },
  orange: { light: orangeLight, dark: orangeDark },
  blue: { light: blueLight, dark: blueDark },
  pink: { light: pinkLight, dark: pinkDark },
  gold: { light: goldLight, dark: goldDark },
  crimson: { light: crimsonLight, dark: crimsonDark },
  cosmic: { light: cosmicLight, dark: cosmicDark },
};

// Example spacing overrides — add in-between steps
// const spacingOverrides = {
//   's-1': 6,   // bump xs
//   's-2': 10,  // more breathing room
// };

// Example rounded overrides — softer or sharper radii
// const roundedOverrides = {
//   'r-2': 10,  // rounder cards
//   'r-3': 18,  // pill-ier buttons
// };

export const buildTheme = (preset: TThemePreset, colorScheme: TColorScheme) =>
  createVajraTheme({
    colorScheme,
    fonts: appFonts,
    colors: PRESET_COLORS[preset][colorScheme],
    // spacing: spacingOverrides,
    // rounded: roundedOverrides,
  });
