import { TSeparatorOrientation, TSeparatorVariant } from '@88khp/vajra-core';

import { TVajraColors } from '../../vajra-theme/colors';
import { TSpacingToken } from '../../vajra-theme/tokens/spacing-tokens';

export type TDividerProps = {
  orientation?: TSeparatorOrientation;
  thickness?: number;
  color?: TVajraColors;
  variant?: TSeparatorVariant;
  /** Margin pulled in from both ends of the line (horizontal orientation only). */
  inset?: TSpacingToken;
  /** Text rendered centered over the line, e.g. "OR". Horizontal orientation only. */
  label?: string;
};
