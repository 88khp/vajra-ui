import React from 'react';

import { Box } from '../box';
import { TUiAbsoluteViewProps } from './absolute-view-types';

export const AbsoluteView = (props: TUiAbsoluteViewProps) => <Box position="absolute" {...props} />;

AbsoluteView.displayName = 'AbsoluteView';
