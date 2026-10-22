import React, { memo } from 'react';
import { View, ViewStyle } from 'react-native';

import { BOX_STYLE_SPEC, splitStyleProps } from '@88khp/vajra-core';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { TUiSpacerProps } from './spacer-types';

const SpacerComponent: React.FC<TUiSpacerProps> = ({ w, h }) => {
  const { spacing } = useVajraTheme();
  const [style] = splitStyleProps<object, ViewStyle>(
    { w: w !== undefined ? spacing[w] : undefined, h: h !== undefined ? spacing[h] : undefined },
    BOX_STYLE_SPEC,
  );

  return <View style={style} />;
};

export const Spacer = memo(SpacerComponent);
Spacer.displayName = 'Spacer';
