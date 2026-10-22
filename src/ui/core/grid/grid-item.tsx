import React, { useContext } from 'react';

import { useDimensions } from '@88khp/vajra-core';
import { Box } from '../box';
import { GridContext } from './grid-context';
import { TUiGridItemProps } from './grid-types';

// Not memoized: it takes children, so a props comparison would never skip a render.
export const GridItem = ({
  span = 1,
  columns = 2,
  colGap = 0,
  screenPadding = 0,
  style,
  ...rest
}: TUiGridItemProps) => {
  const parentWidth = useContext(GridContext);
  const { getItemWidth } = useDimensions(screenPadding);
  const singleColWidth =
    parentWidth !== null
      ? (parentWidth - colGap * (columns - 1)) / columns
      : getItemWidth(columns, colGap);
  const width = singleColWidth * span + colGap * (span - 1);

  return <Box w={width} style={style} {...rest} />;
};

GridItem.displayName = 'Grid.Item';
