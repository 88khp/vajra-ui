import React, { forwardRef, memo } from 'react';
import { TextInput as RNTextInput, TextInputProps, TextStyle } from 'react-native';

import { composeStyle, splitStyleProps, TEXT_INPUT_STYLE_SPEC } from '@88khp/vajra-ui-core';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { getTokenResolver, TEXT_INPUT_TOKEN_SPEC } from '../../utils/token-props';
import { TTextInputInstance, TUiTextInputProps } from './text-input-types';

// Renders React Native TextInput directly with core's style builder, the same
// way Box renders View, instead of going through CoreTextInput.
const TextInputComponent = forwardRef<TTextInputInstance, TUiTextInputProps>(
  // placeholderColor is read from props and left out by the spec's `omit`.
  (props, ref) => {
    const theme = useVajraTheme();
    const [inputStyle, rest] = splitStyleProps<TextInputProps, TextStyle>(
      props,
      TEXT_INPUT_STYLE_SPEC,
      getTokenResolver(theme, TEXT_INPUT_TOKEN_SPEC),
    );

    return (
      <RNTextInput
        ref={ref}
        placeholderTextColor={
          props.placeholderColor !== undefined ? theme.colors[props.placeholderColor] : undefined
        }
        {...rest}
        style={composeStyle(inputStyle, props.style)}
      />
    );
  },
);

TextInputComponent.displayName = 'TextInput';

export const TextInput = memo(TextInputComponent);
