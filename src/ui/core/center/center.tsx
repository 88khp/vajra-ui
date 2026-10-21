import React from 'react';

import { Box } from '../box';
import { TUiCenterProps } from './center-types';

const Center = (props: TUiCenterProps) => <Box align="center" justify="center" {...props} />;

Center.displayName = 'Center';

export { Center };
