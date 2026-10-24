import React from 'react';

import { TVajraColors } from '../../vajra-theme/colors';
import { TRoundedToken } from '../../vajra-theme/tokens/rounded-tokens';

export type TPopoverPlacement = 'top' | 'bottom';
export type TPopoverAlign = 'start' | 'end';

export type TPopoverProps = {
  /** Trigger element the popover is anchored to. */
  children: React.ReactNode;
  /** Popover body content. */
  content: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;

  /** Which side of the trigger the content opens toward. Defaults to 'bottom'. */
  placement?: TPopoverPlacement;
  /** Horizontal alignment of the content relative to the trigger. Defaults to 'start'. */
  align?: TPopoverAlign;

  bg?: TVajraColors;
  rounded?: TRoundedToken;

  /** Closes the popover when tapping outside its content. Defaults to true. */
  closeOnOutsidePress?: boolean;

  testID?: string;
};
