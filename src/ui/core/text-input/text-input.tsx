import React, { forwardRef, memo } from 'react';

import { CoreTextInput } from '@devraj-labs/vajra-ui-core';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { resolveSpacing } from '../../utils/spacing-props';
import { TTextInputInstance, TUiTextInputProps } from './text-input-types';

const TextInputComponent = forwardRef<TTextInputInstance, TUiTextInputProps>(
  (
    {
      bg,
      borderColor,
      rounded,
      color,
      placeholderColor,
      m,
      mx,
      my,
      mt,
      mb,
      ml,
      mr,
      p,
      px,
      py,
      pt,
      pb,
      pl,
      pr,
      gap,
      ...rest
    },
    ref,
  ) => {
    const { colors, rounded: r, spacing: spacingTokens } = useVajraTheme();
    const spacing = resolveSpacing(
      { m, mx, my, mt, mb, ml, mr, p, px, py, pt, pb, pl, pr, gap },
      spacingTokens,
    );

    return (
      <CoreTextInput
        ref={ref}
        bg={bg !== undefined ? colors[bg] : undefined}
        borderColor={borderColor !== undefined ? colors[borderColor] : undefined}
        rounded={rounded !== undefined ? r[rounded] : undefined}
        color={color !== undefined ? colors[color] : undefined}
        placeholderColor={placeholderColor !== undefined ? colors[placeholderColor] : undefined}
        {...spacing}
        {...rest}
      />
    );
  },
);

TextInputComponent.displayName = 'TextInput';

export const TextInput = memo(TextInputComponent);
