import React, { useMemo, useState } from 'react';

import { InputContextProvider } from '../../input-context';
import { TInputProps } from '../../input-types';
import { Col } from '../../../../core';

export type TInputRootProps = Pick<
  TInputProps,
  'isInvalid' | 'isDisabled' | 'isReadOnly' | 'errorText' | 'size'
> & {
  children: React.ReactNode;
};

// Not a forwardRef: it holds no element to attach a ref to.
const InputRootComponent = ({
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  errorText,
  size = 'md',
  children,
}: TInputRootProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = isInvalid || !!errorText;
  // Memoized so context consumers only re-render when a value changes.
  const context = useMemo(
    () => ({ isFocused, hasError, isDisabled, isReadOnly, size, setIsFocused }),
    [isFocused, hasError, isDisabled, isReadOnly, size],
  );

  return (
    <InputContextProvider value={context}>
      <Col>{children}</Col>
    </InputContextProvider>
  );
};

InputRootComponent.displayName = 'InputRoot';

export const InputRoot = InputRootComponent;
