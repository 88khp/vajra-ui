import { TCorePressableProps } from '@88khp/vajra-core';
import { TVajraColors } from '../../vajra-theme/colors';
import { TRoundedToken } from '../../vajra-theme/tokens/rounded-tokens';
import { TSpacingProps } from '../../utils/spacing-props';

export type TUiPressableProps = Omit<
  TCorePressableProps,
  | 'bg'
  | 'borderColor'
  | 'rounded'
  | 'roundedT'
  | 'roundedB'
  | 'roundedL'
  | 'roundedR'
  | 'm'
  | 'mx'
  | 'my'
  | 'mt'
  | 'mb'
  | 'ml'
  | 'mr'
  | 'p'
  | 'px'
  | 'py'
  | 'pt'
  | 'pb'
  | 'pl'
  | 'pr'
  | 'gap'
> &
  TSpacingProps & {
    bg?: TVajraColors;
    borderColor?: TVajraColors;
    rounded?: TRoundedToken;
    roundedT?: TRoundedToken;
    roundedB?: TRoundedToken;
    roundedL?: TRoundedToken;
    roundedR?: TRoundedToken;
  };
