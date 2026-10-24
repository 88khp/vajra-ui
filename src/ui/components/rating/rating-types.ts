import { TVajraColors } from '../../vajra-theme/colors';
import { TVajraIconComponent } from '../icon-button/icon-button-types';

export type TRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  /** Number of icon cells. Defaults to 5. */
  max?: number;
  /** Read-only display (no onChange needed, taps are ignored). Defaults to false. */
  isReadOnly?: boolean;
  isDisabled?: boolean;

  size?: number;
  color?: TVajraColors;
  emptyColor?: TVajraColors;

  /** Icon used for a filled cell. Defaults to a plain ★ glyph. */
  icon?: TVajraIconComponent;
  /** Icon used for an empty cell. Defaults to a plain ☆ glyph. */
  emptyIcon?: TVajraIconComponent;

  testID?: string;
};
