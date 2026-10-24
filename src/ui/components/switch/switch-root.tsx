import React, { memo } from 'react';

import { Col } from '../../core/col';
import { SwitchContextProvider } from './switch-context';
import { TSwitchRootProps } from './switch-types';

const SwitchRootComponent: React.FC<TSwitchRootProps> = ({
  value,
  onChange,
  color,
  isDisabled = false,
  size = 'md',
  children,
}) => {
  return (
    <SwitchContextProvider value={{ selectedValue: value, onChange, color, isDisabled, size }}>
      <Col gap="s-2">{children}</Col>
    </SwitchContextProvider>
  );
};

export const SwitchRoot = memo(SwitchRootComponent);
SwitchRoot.displayName = 'SwitchRoot';
