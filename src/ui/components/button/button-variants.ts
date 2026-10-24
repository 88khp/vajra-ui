import { createRecipe, TRecipeVariants } from '../../utils/create-recipe';
import { vajraStyle, vajraTextStyle } from '../../vajra-theme/vajra-style';

export const buttonRecipe = createRecipe({
  variants: {
    variant: {
      solid: {
        container: vajraStyle({ backgroundColor: 'primary' }),
        label: vajraTextStyle({ color: 'textInverse' }),
      },
      subtle: {
        container: vajraStyle({ backgroundColor: 'primarySubtle' }),
        label: vajraTextStyle({ color: 'primary' }),
      },
      surface: {
        container: vajraStyle({ backgroundColor: 'surface' }),
        label: vajraTextStyle({ color: 'text' }),
      },
      outline: {
        container: vajraStyle({
          backgroundColor: 'transparent',
          borderColor: 'primary',
          borderWidth: 1,
        }),
        label: vajraTextStyle({ color: 'primary' }),
      },
      ghost: {
        container: vajraStyle({ backgroundColor: 'transparent' }),
        label: vajraTextStyle({ color: 'primary' }),
      },
      plain: {
        container: vajraStyle({ backgroundColor: 'transparent' }),
        label: vajraTextStyle({ color: 'text' }),
      },
    },
    size: {
      xs: {
        container: vajraStyle({ px: 's-2', py: 's-1', rounded: 'r-1' }),
        label: vajraTextStyle({ fontVariant: 'label' }),
        icon: { size: 12 },
      },
      sm: {
        container: vajraStyle({ px: 's-3', py: 's-2', rounded: 'r-1' }),
        label: vajraTextStyle({ fontVariant: 'label' }),
        icon: { size: 14 },
      },
      md: {
        container: vajraStyle({ px: 's-4', py: 's-3', rounded: 'r-2' }),
        label: vajraTextStyle({ fontVariant: 'button' }),
        icon: { size: 16 },
      },
      lg: {
        container: vajraStyle({ px: 's-5', py: 's-3', rounded: 'r-2' }),
        label: vajraTextStyle({ fontVariant: 'button' }),
        icon: { size: 18 },
      },
      xl: {
        container: vajraStyle({ px: 's-6', py: 's-4', rounded: 'r-3' }),
        label: vajraTextStyle({ fontVariant: 'button' }),
        icon: { size: 20 },
      },
    },
  },
});

export type TButtonRecipeVariants = TRecipeVariants<typeof buttonRecipe>;
export type TButtonVariant = NonNullable<TButtonRecipeVariants['variant']>;
export type TButtonSize = NonNullable<TButtonRecipeVariants['size']>;

export const BUTTON_VARIANTS = buttonRecipe.keys.variant;
export const BUTTON_SIZES = buttonRecipe.keys.size;
