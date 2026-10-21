/**
 * Tamagui configuration. Color and typography values are Vajra's default theme, so
 * both themes expose the same token names with the same values as the shared spec.
 *
 * They are read from theme-values.json (written by scripts/snapshot-tamagui-theme.js)
 * rather than shared/spec.ts, because Tamagui's compiler evaluates this file in Node
 * and the spec imports the full @88khp/vajra-ui entry, which Node cannot run. The
 * parity suite checks that the rendered styles still match the spec exactly.
 */
import { createFont, createTamagui, createTokens } from 'tamagui';

import THEME_VALUES from './theme-values.json';

type TColors = (typeof THEME_VALUES)['colors']['light'];
const colorsFor = (theme: 'light' | 'dark'): TColors => THEME_VALUES.colors[theme];
const TYPOGRAPHY = THEME_VALUES.typography;

/** The spec's SIZE values used by this config, in dp. */
const SIZE = {
  actionGap: 8,
  cardGap: 12,
  cardPadding: 16,
  buttonRadius: 8,
  cardRadius: 12,
  statusRadius: 9999,
} as const;

const THEME_KEYS = {
  surface: 'surface',
  surfaceRaised: 'surfaceRaised',
  border: 'border',
  text: 'text',
  textSubtle: 'textSubtle',
  textInverse: 'textInverse',
  primary: 'primary',
  secondary: 'secondary',
  error: 'error',
} as const;

const themeFor = (colors: ReturnType<typeof colorsFor>) =>
  Object.fromEntries(
    Object.entries(THEME_KEYS).map(([token, source]) => [
      token,
      colors[source as keyof typeof colors],
    ]),
  );

const tokens = createTokens({
  color: {},
  space: { s2: SIZE.actionGap, s3: SIZE.cardGap, s4: SIZE.cardPadding },
  size: {},
  radius: { r2: SIZE.buttonRadius, r3: SIZE.cardRadius, rfull: SIZE.statusRadius },
  zIndex: {},
});

export const tamaguiConfig = createTamagui({
  tokens,
  themes: {
    light: themeFor(colorsFor('light')),
    dark: themeFor(colorsFor('dark')),
  },
  fonts: {
    body: createFont({
      family: 'System',
      size: { title: TYPOGRAPHY.title.fontSize, body: TYPOGRAPHY.description.fontSize, button: TYPOGRAPHY.button.fontSize },
      lineHeight: { title: TYPOGRAPHY.title.lineHeight, body: TYPOGRAPHY.description.lineHeight, button: TYPOGRAPHY.button.lineHeight },
      weight: { title: String(TYPOGRAPHY.title.fontWeight), body: String(TYPOGRAPHY.description.fontWeight), button: String(TYPOGRAPHY.button.fontWeight) },
      letterSpacing: {},
    }),
  },
  defaultFont: 'body',
  media: {},
  shorthands: {},
});

export type TTamaguiConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends TTamaguiConfig {}
}
