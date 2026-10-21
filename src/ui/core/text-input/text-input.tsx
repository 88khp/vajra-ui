import React, { forwardRef, memo } from 'react';

import { CoreTextInput, TCoreTextInputProps } from '@88khp/vajra-ui-core';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { resolveTokenProps, TEXT_INPUT_TOKEN_SPEC } from '../../utils/token-props';
import { TTextInputInstance, TUiTextInputProps } from './text-input-types';

const TextInputComponent = forwardRef<TTextInputInstance, TUiTextInputProps>((props, ref) => {
  const theme = useVajraTheme();

  return (
    <CoreTextInput
      ref={ref}
      {...(resolveTokenProps(props, TEXT_INPUT_TOKEN_SPEC, theme) as TCoreTextInputProps)}
    />
  );
});

TextInputComponent.displayName = 'TextInput';

export const TextInput = memo(TextInputComponent);
