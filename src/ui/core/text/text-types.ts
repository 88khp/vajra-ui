import { TTextProps as TCoreTextProps } from '@88khp/vajra-core';
import { TVajraColors } from '../../vajra-theme/colors';
import { TFontVariant } from '../../vajra-theme/tokens/font-tokens/index';
import { TFontSizeToken } from '../../vajra-theme/tokens/font-tokens/font-size-tokens';
import { TSpacingProps } from '../../utils/spacing-props';
import { TFontWeightValue, IVajraFonts } from '../../vajra-theme/create-vajra-theme';

export type TTextProps = Omit<
  TCoreTextProps,
  'fontSize' | 'lineHeight' | 'fontWeight' | 'color' | 'm' | 'mx' | 'my' | 'mt' | 'mb' | 'ml' | 'mr'
> &
  Pick<TSpacingProps, 'm' | 'mx' | 'my' | 'mt' | 'mb' | 'ml' | 'mr'> & {
    variant?: TFontVariant;
    fontSize?: TFontSizeToken;
    lineHeight?: number;
    color?: TVajraColors;
    font?: keyof IVajraFonts;
    fontWeight?: TFontWeightValue;
    fontStyle?: 'normal' | 'italic';
  };
