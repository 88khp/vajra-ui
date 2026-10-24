import React from 'react';

import { TVajraIconComponent } from '../icon-button/icon-button-types';
import { TVajraColors } from '../../vajra-theme/colors';

export type TChipProps = {
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  isDisabled?: boolean;

  selectedBg?: TVajraColors;
  selectedColor?: TVajraColors;
  unselectedBg?: TVajraColors;
  unselectedColor?: TVajraColors;

  /** Leading icon shown before the label. */
  icon?: TVajraIconComponent;
  /** Leading avatar (or any custom element) shown before the label, instead of `icon`. */
  avatar?: React.ReactNode;

  /** Icon shown in the remove button, when `onRemove` is set. Defaults to a plain ✕ glyph. */
  removeIcon?: TVajraIconComponent;

  testID?: string;
};
