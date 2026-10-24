import React, { memo, useCallback } from 'react';

import { Col } from '../../core/col';
import { CheckboxContextProvider } from './checkbox-context';
import { TCheckboxRootProps } from './checkbox-types';

const CheckboxRootComponent: React.FC<TCheckboxRootProps> = ({
  values,
  onChange,
  color,
  isDisabled = false,
  size = 'md',
  icon,
  children,
}) => {
  const toggle = useCallback(
    (value: string) => {
      if (values.includes(value)) {
        onChange(values.filter(v => v !== value));
      } else {
        onChange([...values, value]);
      }
    },
    [values, onChange],
  );

  return (
    <CheckboxContextProvider
      value={{ selectedValues: values, onChange: toggle, color, isDisabled, size, icon }}
    >
      <Col gap="s-2">{children}</Col>
    </CheckboxContextProvider>
  );
};

export const CheckboxRoot = memo(CheckboxRootComponent);
CheckboxRoot.displayName = 'CheckboxRoot';
