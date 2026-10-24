import React, { memo } from 'react';

import { Col } from '../../core/col';
import { RadioContextProvider } from './radio-context';
import { TRadioRootProps } from './radio-types';

const RadioRootComponent: React.FC<TRadioRootProps> = ({
  value,
  onChange,
  color,
  isDisabled = false,
  size = 'md',
  children,
}) => {
  return (
    <RadioContextProvider value={{ selectedValue: value, onChange, color, isDisabled, size }}>
      <Col gap="s-2">{children}</Col>
    </RadioContextProvider>
  );
};

export const RadioRoot = memo(RadioRootComponent);
RadioRoot.displayName = 'RadioRoot';
