import React, { memo, useContext } from 'react';

import { useDimensions } from '@devraj-labs/vajra-ui-core';
import { Box } from '../box';
import { GridContext } from './grid-context';
import { TUiGridItemProps } from './grid-types';

export const GridItem = memo<TUiGridItemProps>(
  ({ span = 1, columns = 2, colGap = 0, screenPadding = 0, style, ...rest }) => {
    const parentWidth = useContext(GridContext);
    const { getItemWidth } = useDimensions(screenPadding);
    const singleColWidth =
      parentWidth !== null
        ? (parentWidth - colGap * (columns - 1)) / columns
        : getItemWidth(columns, colGap);
    const width = singleColWidth * span + colGap * (span - 1);

    return <Box w={width} style={style} {...rest} />;
  },
);

GridItem.displayName = 'Grid.Item';
