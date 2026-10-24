import React from 'react';

import { TModalAnimation } from '../modal/modal-types';
import { TVajraColors } from '../../vajra-theme/colors';
import { TRoundedToken } from '../../vajra-theme/tokens/rounded-tokens';
import { TSpacingToken } from '../../vajra-theme/tokens/spacing-tokens';

export type TSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;

  closeOnBackdropPress?: boolean;

  /** How the sheet enters/exits. Defaults to 'slide'. */
  animation?: TModalAnimation;

  /** Drag the sheet down to dismiss it. Defaults to true. */
  dismissOnDrag?: boolean;

  bg?: TVajraColors;
  /** Top-corners-only radius (Sheet is bottom-anchored and full-width). */
  roundedT?: TRoundedToken;
  p?: TSpacingToken;

  backdropColor?: TVajraColors;

  testID?: string;
};
