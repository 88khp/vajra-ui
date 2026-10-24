import React from 'react';

import { TModalAnimation } from '../modal/modal-types';
import { TVajraColors } from '../../vajra-theme/colors';
import { TRoundedToken } from '../../vajra-theme/tokens/rounded-tokens';
import { TSpacingToken } from '../../vajra-theme/tokens/spacing-tokens';

export type TDrawerEdge = 'left' | 'right';

export type TDrawerProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;

  /** Which edge the drawer slides in from. Defaults to 'left'. */
  edge?: TDrawerEdge;

  closeOnBackdropPress?: boolean;

  /** How the drawer enters/exits. Defaults to 'slide'. */
  animation?: TModalAnimation;

  /** Drag the drawer toward its edge to dismiss it. Defaults to true. */
  dismissOnDrag?: boolean;

  /** Width of the drawer panel. Defaults to 300. */
  width?: number;

  bg?: TVajraColors;
  rounded?: TRoundedToken;
  p?: TSpacingToken;

  backdropColor?: TVajraColors;

  testID?: string;
};
