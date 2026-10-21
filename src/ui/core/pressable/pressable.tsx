import React from 'react';
import { Pressable as RNPressable, PressableProps, ViewStyle } from 'react-native';

import {
  composeStyle,
  getPressableStyle,
  PRESSABLE_STYLE_SPEC,
  splitStyleProps,
} from '@88khp/vajra-ui-core';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { BOX_TOKEN_SPEC, getTokenResolver } from '../../utils/token-props';
import { TUiPressableProps } from './pressable-types';

// Renders React Native Pressable directly with core's style builder, the same
// way Box renders View, instead of going through CorePressable.
//
// Not memoized: it takes children, so a props comparison would never skip a render.
// activeOpacity is read from props and left out by the spec's `omit`.
export const Pressable = (props: TUiPressableProps) => {
  const theme = useVajraTheme();
  const [boxStyle, rest] = splitStyleProps<PressableProps, ViewStyle>(
    props,
    PRESSABLE_STYLE_SPEC,
    getTokenResolver(theme, BOX_TOKEN_SPEC),
  );

  return (
    <RNPressable
      {...rest}
      style={getPressableStyle(composeStyle(boxStyle, props.style), props.activeOpacity)}
    />
  );
};

Pressable.displayName = 'Pressable';
