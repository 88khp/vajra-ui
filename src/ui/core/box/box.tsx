import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

import { BOX_STYLE_SPEC, composeStyle, splitStyleProps } from '@88khp/vajra-ui-core';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { BOX_TOKEN_SPEC, resolveTokenProps } from '../../utils/token-props';
import { TUiBoxProps } from './box-types';

// Renders View directly with core's style builder instead of going through
// CoreBox, so a Box is one component layer over View.
//
// Not memoized: Box takes children, which are new elements on every parent
// render, so a props comparison would never skip a render.
export const Box = (props: TUiBoxProps) => {
  const theme = useVajraTheme();
  const [boxStyle, rest] = splitStyleProps<ViewProps, ViewStyle>(
    resolveTokenProps(props, BOX_TOKEN_SPEC, theme),
    BOX_STYLE_SPEC,
  );

  return <View {...rest} style={composeStyle(boxStyle, props.style)} />;
};

Box.displayName = 'Box';
