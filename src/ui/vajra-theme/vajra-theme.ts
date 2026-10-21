import { lightColorTokens, darkColorTokens } from './colors';
import { spacingTokens } from './tokens/spacing-tokens';
import { roundedTokens } from './tokens/rounded-tokens';
import { fontVariants } from './tokens/font-tokens/index';
import { fontSizeTokens } from './tokens/font-tokens/font-size-tokens';
import { lineHeightTokens } from './tokens/font-tokens/line-height-tokens';
import { layoutTokens } from './tokens/layout-tokens';
import { notificationTokens } from './tokens/notification-tokens';
import { appBarTokens } from './tokens/app-bar-tokens';

const staticTokens = {
  spacing: spacingTokens,
  rounded: roundedTokens,
  typography: fontVariants,
  fontSizes: fontSizeTokens as Record<string, number>,
  lineHeights: lineHeightTokens as Record<string, number>,
  layout: layoutTokens,
  toast: notificationTokens.toast,
  alert: notificationTokens.alert,
  appBar: appBarTokens,
};

export const defaultVajraTheme = {
  light: {
    colors: lightColorTokens,
    ...staticTokens,
  },
  dark: {
    colors: darkColorTokens,
    ...staticTokens,
  },
};
