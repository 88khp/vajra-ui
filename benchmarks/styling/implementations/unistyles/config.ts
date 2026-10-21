/**
 * Unistyles configuration. Theme values come from the shared spec.
 * Unistyles keeps the active theme in a native runtime, so switching themes is a
 * UnistylesRuntime call, not a React prop.
 */
import { StyleSheet } from 'react-native-unistyles';

import { colorsFor, SIZE, TYPOGRAPHY } from '../../shared/spec';

const appTheme = (colors: ReturnType<typeof colorsFor>) => ({
  colors: {
    surface: colors.surface,
    surfaceRaised: colors.surfaceRaised,
    border: colors.border,
    text: colors.text,
    textSubtle: colors.textSubtle,
    textInverse: colors.textInverse,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
  },
  sizes: SIZE,
  typography: TYPOGRAPHY,
});

export const unistylesThemes = {
  light: appTheme(colorsFor('light')),
  dark: appTheme(colorsFor('dark')),
};

type TUnistylesAppTheme = typeof unistylesThemes.light;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: TUnistylesAppTheme;
    dark: TUnistylesAppTheme;
  }
}

StyleSheet.configure({
  themes: unistylesThemes,
  settings: { initialTheme: 'light' },
});
