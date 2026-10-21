export const roundedTokens = {
  'r-0': 0,
  'r-1': 4,
  'r-2': 8,
  'r-3': 12,
  'r-4': 16,
  'r-5': 20,
  'r-6': 24,
  'r-7': 28,
  'r-8': 32,
  'r-9': 36,
  'r-10': 40,
  'r-full': 9999,
} as const;

// Augment this interface in your app to add custom rounded tokens with autocomplete:
// declare module '@88khp/vajra-ui' {
//   interface IVajraRoundedTokens {
//     'r-12': number;
//     'r-16': number;
//   }
// }
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
export interface IVajraRoundedTokens {}

export type TRoundedToken = keyof typeof roundedTokens | keyof IVajraRoundedTokens;
