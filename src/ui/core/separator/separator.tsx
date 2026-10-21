import React, { memo } from 'react';

import { Separator as CoreSeparator } from '@88khp/vajra-ui-core';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { TUiSeparatorProps } from './separator-types';

const SeparatorComponent: React.FC<TUiSeparatorProps> = ({ color = 'border', ...rest }) => {
  const { colors } = useVajraTheme();

  return <CoreSeparator color={colors[color]} {...rest} />;
};

export const Separator = memo(SeparatorComponent);
Separator.displayName = 'Separator';
