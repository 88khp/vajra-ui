import type { TextStyle } from 'react-native';

import { fontSizeTokens, TFontSizeToken, IVajraFontSizeTokens } from './font-size-tokens';

export type { IVajraFontSizeTokens };
import { fontWeightTokens, TFontWeightToken } from './font-weight-tokens';
import { lineHeightTokens } from './line-height-tokens';

export type TFontVariantProps = {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700';
  fontVariant?: TextStyle['fontVariant'];
};

const f = (scale: TFontSizeToken, weight: TFontWeightToken): TFontVariantProps => ({
  fontSize: fontSizeTokens[scale],
  lineHeight: lineHeightTokens[scale],
  fontWeight: fontWeightTokens[weight],
});

export const fontVariants = {
  // Labels & captions
  label: f('f-1', 'f-400'),
  labelMedium: f('f-1', 'f-500'),
  caption: f('f-1.5', 'f-400'),

  // Body copy
  bodySmall: f('f-1.5', 'f-400'),
  body: f('f-2', 'f-400'),
  bodyMedium: f('f-2', 'f-500'),

  // UI chrome
  button: f('f-2', 'f-600'),
  subheading: f('f-3', 'f-500'),

  // Headings
  h3: f('f-3', 'f-600'),
  h2: f('f-4', 'f-600'),
  h1: f('f-5', 'f-700'),

  // Display
  display: f('f-6', 'f-700'),
} satisfies Record<string, TFontVariantProps>;

// Augment this interface in your app to add custom typography variants with autocomplete:
// declare module '@devraj-labs/vajra-ui' {
//   interface IVajraFontVariants {
//     displayLarge: TFontVariantProps;
//     eyebrow: TFontVariantProps;
//   }
// }
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
export interface IVajraFontVariants {}

export type TFontVariant = keyof typeof fontVariants | keyof IVajraFontVariants;
