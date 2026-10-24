import React, { memo, useEffect, useMemo, useRef, useState } from 'react';

import { Text } from '../../core/text';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { Input } from '../input';
import { TSearchbarProps } from './searchbar-types';

const SearchbarComponent: React.FC<TSearchbarProps> = ({
  icon: Icon,
  debounceMs = 0,
  value,
  onChangeText,
  placeholder = 'Search…',
  rounded = true,
  ...rest
}) => {
  const { colors } = useVajraTheme();
  const [internalValue, setInternalValue] = useState(value ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  const handleChangeText = useMemo(
    () => (text: string) => {
      setInternalValue(text);

      if (debounceMs <= 0) {
        onChangeText?.(text);

        return;
      }

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChangeText?.(text), debounceMs);
    },
    [debounceMs, onChangeText],
  );

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <Input.Outline
      value={internalValue}
      onChangeText={handleChangeText}
      placeholder={placeholder}
      rounded={rounded}
      isClearable
      startElement={
        Icon ? (
          <Icon size={16} width={16} height={16} color={colors.textMuted} />
        ) : (
          <Text variant="label" color="textMuted">
            🔍
          </Text>
        )
      }
      {...rest}
    />
  );
};

export const Searchbar = memo(SearchbarComponent);
Searchbar.displayName = 'Searchbar';
