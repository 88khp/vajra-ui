import React from 'react';

import { Box } from '../box';
import { TUiRowProps } from './row-types';

const Row = (props: TUiRowProps) => <Box direction="row" {...props} />;

Row.displayName = 'Row';

export { Row };
