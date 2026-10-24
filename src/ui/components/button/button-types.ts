import React from 'react';

import { TUiPressableProps } from '../../core/pressable/pressable-types';
import { TTextProps } from '../../core/text/text-types';
import { TVajraIconComponent } from '../icon-button/icon-button-types';
import { TButtonSize, TButtonVariant } from './button-variants';
import { TVajraTone } from '../../utils/tone';

export type { TButtonSize, TButtonVariant };

export type TButtonLoadingPosition = 'start' | 'end';

export type TButtonLoadingProps = {
  position?: TButtonLoadingPosition;
  label?: string;
  loader?: React.ReactNode;
};

export type TButtonProps = Omit<TUiPressableProps, 'disabled'> & {
  variant?: TButtonVariant;
  size?: TButtonSize;
  tone?: TVajraTone;
  label: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isPill?: boolean;
  loading?: TButtonLoadingProps;
  labelProps?: Omit<TTextProps, 'color' | 'variant'>;
  leftIcon?: TVajraIconComponent;
  rightIcon?: TVajraIconComponent;
};
