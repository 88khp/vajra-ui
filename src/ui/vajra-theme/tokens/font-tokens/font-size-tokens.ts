export const fontSizeTokens = {
  'f-1': 12,
  'f-1.5': 14,
  'f-2': 16,
  'f-2.5': 18,
  'f-3': 20,
  'f-4': 24,
  'f-5': 28,
  'f-6': 32,
} as const;

// Augment this interface in your app to add custom font size tokens:
// declare module '@88khp/vajra-ui' {
//   interface IVajraFontSizeTokens {
//     'f-2.5': number;
//   }
// }
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
export interface IVajraFontSizeTokens {}

export type TFontSizeToken = keyof typeof fontSizeTokens | keyof IVajraFontSizeTokens;
