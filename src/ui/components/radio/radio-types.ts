import React from 'react';

import { TVajraColors } from '../../vajra-theme/colors';

export type TRadioSize = 'xs' | 'sm' | 'md' | 'lg';

export type TRadioRootProps = {
  value: string;
  onChange: (value: string) => void;
  color?: TVajraColors;
  isDisabled?: boolean;
  size?: TRadioSize;
  children: React.ReactNode;
};
