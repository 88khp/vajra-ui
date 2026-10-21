import { brandLight, brandDark } from './brand';
import { surfaceLight, surfaceDark } from './surface';
import { textLight, textDark } from './text';
import { borderLight, borderDark } from './border';
import { feedbackLight, feedbackDark } from './feedback';

export const lightColorTokens = {
  ...brandLight,
  ...surfaceLight,
  ...textLight,
  ...borderLight,
  ...feedbackLight,
  transparent: 'transparent' as const,
};

export const darkColorTokens = {
  ...brandDark,
  ...surfaceDark,
  ...textDark,
  ...borderDark,
  ...feedbackDark,
  transparent: 'transparent' as const,
};

// Augment this interface in your app to add custom color tokens:
// declare module '@88khp/vajra-ui' {
//   interface IVajraCustomColors {
//     brandGold: string;
//     surfaceAccent: string;
//   }
// }
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
export interface IVajraCustomColors {}

export type TVajraColors = keyof typeof lightColorTokens | keyof IVajraCustomColors;

export const SEMANTIC_COLORS = [...Object.keys(brandLight), ...Object.keys(feedbackLight)].filter(
  k => !k.endsWith('Muted') && !k.endsWith('Subtle'),
) as TVajraColors[];
