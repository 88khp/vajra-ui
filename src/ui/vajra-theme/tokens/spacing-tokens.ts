export const spacingTokens = {
  // Scale tokens
  's-0': 0,
  's-1': 4,
  's-2': 8,
  's-3': 12,
  's-4': 16,
  's-5': 20,
  's-6': 24,
  's-8': 32,
  's-10': 40,
  's-12': 48,
  's-16': 64,
} as const;

// Augment this interface in your app to add custom spacing tokens with autocomplete:
// declare module '@88khp/vajra-ui' {
//   interface IVajraSpacingTokens {
//     's-20': number;
//     's-24': number;
//   }
// }
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
export interface IVajraSpacingTokens {}

export type TSpacingToken = keyof typeof spacingTokens | keyof IVajraSpacingTokens;
