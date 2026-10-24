import React from 'react';
import { TextInput } from 'react-native';

import { TTextProps } from '../../core';
import { TUiTextInputProps } from '../../core/text-input/text-input-types';
import { TVajraIconComponent } from '../icon-button/icon-button-types';

export type TInputSize = 'xs' | 'sm' | 'md' | 'lg';

export type TInputSizeStyle = {
  height: number;
  inputText: TTextProps;
  labelText: TTextProps;
  helperText: TTextProps;
};

export type TInputProps = Omit<
  TUiTextInputProps,
  'bg' | 'borderColor' | 'rounded' | 'p' | 'px' | 'py'
> & {
  size?: TInputSize;
  rounded?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  /** Shows a clear ("x") button when the field has a value; calls onChangeText with '' on press. */
  isClearable?: boolean;
  /** Icon used by the clear button. Defaults to a plain ✕ glyph. */
  clearIcon?: TVajraIconComponent;
  ref?: React.Ref<TextInput>;
};
