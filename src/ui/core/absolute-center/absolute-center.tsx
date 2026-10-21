import React from 'react';

import { Box } from '../box';
import { TUiAbsoluteCenterProps } from './absolute-center-types';

// The fill is built from Box props rather than an inline style object, so it
// is part of the cached style and can be overridden by passing top/left/etc.
export const AbsoluteCenter = (props: TUiAbsoluteCenterProps) => (
  <Box
    position="absolute"
    top={0}
    bottom={0}
    left={0}
    right={0}
    align="center"
    justify="center"
    {...props}
  />
);

AbsoluteCenter.displayName = 'AbsoluteCenter';
