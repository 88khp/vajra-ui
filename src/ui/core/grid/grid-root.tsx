import React, { useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { resolveSpacing } from '../../utils/spacing-props';
import { Box } from '../box';
import { GridContext } from './grid-context';
import { TUiGridRootProps } from './grid-types';

// Not memoized: it takes children, so a props comparison would never skip a render.
export const GridRoot = ({ onLayout, p, px, pl, pr, ...rest }: TUiGridRootProps) => {
  const [width, setWidth] = useState<number | null>(null);
  const { spacing } = useVajraTheme();
  const padding = resolveSpacing({ p, px, pl, pr }, spacing);
  const paddingX =
    (padding.pl ?? padding.px ?? padding.p ?? 0) + (padding.pr ?? padding.px ?? padding.p ?? 0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width - paddingX);
    onLayout?.(event);
  };

  return (
    <GridContext.Provider value={width}>
      <Box
        direction="row"
        wrap="wrap"
        p={p}
        px={px}
        pl={pl}
        pr={pr}
        onLayout={handleLayout}
        {...rest}
      />
    </GridContext.Provider>
  );
};

GridRoot.displayName = 'Grid.Root';
