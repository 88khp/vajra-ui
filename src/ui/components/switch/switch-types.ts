import React from 'react';

import { TVajraColors } from '../../vajra-theme/colors';

export type TSwitchSize = 'xs' | 'sm' | 'md' | 'lg';

export type TSwitchRootProps = {
  value: string;
  onChange: (value: string) => void;
  color?: TVajraColors;
  isDisabled?: boolean;
  size?: TSwitchSize;
  children: React.ReactNode;
};

export type TSwitchProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  color?: TVajraColors;
  isDisabled?: boolean;
  size?: TSwitchSize;
};
