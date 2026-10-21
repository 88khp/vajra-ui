import React, { forwardRef } from 'react';
import { TextInputProps } from 'react-native';

import { fontVariants, TFontVariant } from '../../../../vajra-theme/tokens/font-tokens';
import { TextInput } from '../../../../core/text-input';
import {
  TTextInputInstance,
  TUiTextInputProps,
} from '../../../../core/text-input/text-input-types';
import { useInputContext } from '../../input-context';
import { TInputSize } from '../../input-types';
import { getInputSizeStyle } from '../../input-utils';

export type TInputFieldProps = Omit<
  TUiTextInputProps,
  'bg' | 'borderColor' | 'rounded' | 'p' | 'px' | 'py'
> & {
  size?: TInputSize;
};

const InputFieldComponent = forwardRef<TTextInputInstance, TInputFieldProps>(
  ({ size = 'md', color, onFocus, onBlur, ...rest }, ref) => {
    const { setIsFocused, isDisabled, isReadOnly } = useInputContext();
    const sizeStyle = getInputSizeStyle(size);
    const inputVariant = sizeStyle.inputText.variant ?? 'body';
    const { fontSize, lineHeight } = fontVariants[inputVariant as TFontVariant];

    return (
      <TextInput
        ref={ref}
        style={{ flex: 1, fontSize, lineHeight }}
        color={color ?? 'text'}
        placeholderColor="textMuted"
        editable={!isDisabled && !isReadOnly}
        onFocus={(e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
          setIsFocused(true);
          (onFocus as TextInputProps['onFocus'])?.(e);
        }}
        onBlur={(e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
          setIsFocused(false);
          (onBlur as TextInputProps['onBlur'])?.(e);
        }}
        {...rest}
      />
    );
  },
);

InputFieldComponent.displayName = 'InputField';

export const InputField = InputFieldComponent;
