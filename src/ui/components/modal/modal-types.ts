import React from 'react';

import { TVajraColors } from '../../vajra-theme/colors';
import { TRoundedToken } from '../../vajra-theme/tokens/rounded-tokens';
import { TSpacingToken } from '../../vajra-theme/tokens/spacing-tokens';

export type TModalContentAlign = 'center' | 'bottom' | 'left' | 'right';

export type TModalAnimation = 'fade' | 'slide' | 'scale';

export type TModalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;

  closeOnBackdropPress?: boolean;

  /** How the content enters/exits. 'scale' fades + scales the content; 'slide' uses RN's native slide. Defaults to 'fade'. */
  animation?: TModalAnimation;

  /** Where the content sits within the backdrop. Sheet uses 'bottom'. */
  contentAlign?: TModalContentAlign;

  bg?: TVajraColors;
  /** Uniform corner radius. Ignored if roundedT/roundedL/roundedR is set. */
  rounded?: TRoundedToken;
  /** Top-corners-only radius — useful for bottom-anchored content (Sheet). */
  roundedT?: TRoundedToken;
  /** Left-corners-only radius — useful for right-anchored content (Drawer). */
  roundedL?: TRoundedToken;
  /** Right-corners-only radius — useful for left-anchored content (Drawer). */
  roundedR?: TRoundedToken;
  p?: TSpacingToken;

  backdropColor?: TVajraColors;

  testID?: string;
};
