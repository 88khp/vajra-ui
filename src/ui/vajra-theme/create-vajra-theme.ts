import { TVajraColors, IVajraCustomColors, lightColorTokens } from './colors';
import { defaultVajraTheme } from './vajra-theme';
import { TRoundedToken } from './tokens/rounded-tokens';
import { TSpacingToken, IVajraSpacingTokens } from './tokens/spacing-tokens';
import { TFontVariant, TFontVariantProps } from './tokens/font-tokens/index';
import { TAppBarTokens } from './tokens/app-bar-tokens';

export type TFontWeightValue = '200' | '300' | '400' | '500' | '600' | '700' | '800';
export type TFontItalicWeightValue = '200i' | '300i' | '400i' | '500i' | '600i' | '700i' | '800i';
export type TFontFamilyMap = Partial<Record<TFontWeightValue | TFontItalicWeightValue, string>>;
export type TFontFamilies = Record<string, TFontFamilyMap>;

// Augment this interface in your app to get font autocomplete on <Text font="..." />
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
export interface IVajraFonts {}

export type TVajraColorOverrides = Partial<Record<TVajraColors, string>>;
export type TVajraSpacingOverrides = Partial<Record<TSpacingToken, number>>;
export type TVajraRoundedOverrides = Partial<Record<TRoundedToken, number>>;
export type TVajraTypographyOverrides = Partial<Record<TFontVariant, TFontVariantProps>>;
export type TVajraFontSizeOverrides = Record<string, number>;
export type TVajraLineHeightOverrides = Record<string, number>;
export type TVajraToastOverrides = Partial<{ maxVisible: number }>;
export type TVajraAlertOverrides = Partial<{ maxVisible: number }>;
export type TVajraAppBarOverrides = Partial<TAppBarTokens>;

export type TVajraThemeWithFonts<F extends TFontFamilies> = Omit<
  typeof defaultVajraTheme.light,
  'colors' | 'spacing'
> & {
  colors: typeof lightColorTokens & IVajraCustomColors;
  spacing: typeof defaultVajraTheme.light.spacing & IVajraSpacingTokens;
  fonts: F;
  defaultFont?: keyof F;
};

export const createVajraTheme = <F extends TFontFamilies>(config: {
  colorScheme?: 'light' | 'dark';
  fonts: F;
  defaultFont?: keyof F;
  colors?: TVajraColorOverrides;
  spacing?: TVajraSpacingOverrides;
  rounded?: TVajraRoundedOverrides;
  typography?: TVajraTypographyOverrides;
  fontSizes?: TVajraFontSizeOverrides;
  lineHeights?: TVajraLineHeightOverrides;
  toast?: TVajraToastOverrides;
  alert?: TVajraAlertOverrides;
  appBar?: TVajraAppBarOverrides;
}): TVajraThemeWithFonts<F> => {
  const base = defaultVajraTheme[config.colorScheme ?? 'light'];

  return {
    ...base,
    colors: { ...base.colors, ...config.colors },
    spacing: { ...base.spacing, ...config.spacing },
    rounded: { ...base.rounded, ...config.rounded },
    typography: { ...base.typography, ...config.typography },
    fontSizes: { ...base.fontSizes, ...config.fontSizes },
    lineHeights: { ...base.lineHeights, ...config.lineHeights },
    toast: { ...base.toast, ...config.toast },
    alert: { ...base.alert, ...config.alert },
    appBar: { ...base.appBar, ...config.appBar },
    fonts: config.fonts,
    defaultFont: config.defaultFont,
  } as TVajraThemeWithFonts<F>;
};
