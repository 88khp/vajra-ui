import React from 'react';

import { CorePressable, TCorePressableProps } from '@88khp/vajra-ui-core';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { BOX_TOKEN_SPEC, resolveTokenProps } from '../../utils/token-props';
import { TUiPressableProps } from './pressable-types';

// Not memoized: it takes children, so a props comparison would never skip a render.
export const Pressable = (props: TUiPressableProps) => {
  const theme = useVajraTheme();

  return (
    <CorePressable {...(resolveTokenProps(props, BOX_TOKEN_SPEC, theme) as TCorePressableProps)} />
  );
};

Pressable.displayName = 'Pressable';
