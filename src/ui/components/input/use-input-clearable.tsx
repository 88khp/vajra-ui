import React from 'react';

import { InputClearButton } from './components/input-clear-button';
import { TInputProps } from './input-types';

type TUseInputClearableArgs = Pick<TInputProps, 'isClearable' | 'clearIcon' | 'endElement'> & {
  /** Current display value (controlled value or the caller's own internal mirror). */
  displayValue: unknown;
  /** Called with '' to clear — hook up to whatever onChangeText path the variant already uses. */
  onClear: () => void;
};

// Shared across all Input variants (Outline/Filled/Flushed/Floating) so the
// clear-button behavior stays identical everywhere. Each variant keeps owning
// its own value tracking and passes the resolved display value in.
export const useInputClearable = ({
  isClearable,
  clearIcon,
  endElement,
  displayValue,
  onClear,
}: TUseInputClearableArgs): React.ReactNode => {
  if (!isClearable) return endElement;

  const showClear = typeof displayValue === 'string' && displayValue.length > 0;

  return showClear ? <InputClearButton icon={clearIcon} onPress={onClear} /> : endElement;
};
