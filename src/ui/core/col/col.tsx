import React from 'react';

import { Box } from '../box';
import { TUiColProps } from './col-types';

const Col = (props: TUiColProps) => <Box direction="column" {...props} />;

Col.displayName = 'Col';

export { Col };
