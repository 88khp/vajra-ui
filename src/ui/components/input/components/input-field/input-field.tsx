import React, { forwardRef, useCallback } from 'react';
import { TextInputProps, TextStyle } from 'react-native';

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

type TFocusEvent = Parameters<NonNullable<TextInputProps['onFocus']>>[0];

// One style object per font variant, so the memoized TextInput is not handed a
// new style on every render.
const fieldStyles = new Map<TFontVariant, TextStyle>();

const getFieldStyle = (variant: TFontVariant): TextStyle => {
  let style = fieldStyles.get(variant);

  if (style === undefined) {
    const { fontSize, lineHeight } = fontVariants[variant];

    style = { flex: 1, fontSize, lineHeight };
    fieldStyles.set(variant, style);
  }

  return style;
};

const InputFieldComponent = forwardRef<TTextInputInstance, TInputFieldProps>(
  ({ size = 'md', color, onFocus, onBlur, ...rest }, ref) => {
    const { setIsFocused, isDisabled, isReadOnly } = useInputContext();
    const sizeStyle = getInputSizeStyle(size);
    const inputVariant = sizeStyle.inputText.variant ?? 'body';
    const handleFocus = useCallback(
      (e: TFocusEvent) => {
        setIsFocused(true);
        (onFocus as TextInputProps['onFocus'])?.(e);
      },
      [setIsFocused, onFocus],
    );
    const handleBlur = useCallback(
      (e: TFocusEvent) => {
        setIsFocused(false);
        (onBlur as TextInputProps['onBlur'])?.(e);
      },
      [setIsFocused, onBlur],
    );

    return (
      <TextInput
        ref={ref}
        style={getFieldStyle(inputVariant as TFontVariant)}
        color={color ?? 'text'}
        placeholderColor="textMuted"
        editable={!isDisabled && !isReadOnly}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
    );
  },
);

InputFieldComponent.displayName = 'InputField';

export const InputField = InputFieldComponent;
