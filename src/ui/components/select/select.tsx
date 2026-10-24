import React, { memo, useMemo, useState } from 'react';

import { Box } from '../../core/box';
import { Pressable } from '../../core/pressable';
import { Row } from '../../core/row';
import { Text } from '../../core/text';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { Input } from '../input';
import { Sheet } from '../sheet';
import { SelectOption } from './components/select-option';
import { TSelectOption, TSelectProps } from './select-types';

const SelectComponent = <TValue extends string = string>(props: TSelectProps<TValue>) => {
  const {
    options,
    placeholder = 'Select…',
    label,
    errorText,
    isInvalid = false,
    isDisabled = false,
    selectedColor = 'primary',
    icon: Icon,
    checkIcon,
    isSearchable = false,
    searchPlaceholder = 'Search…',
    searchIcon: SearchIcon,
    testID,
  } = props;

  const { colors } = useVajraTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selectedValues: TValue[] = props.multiple
    ? (props.value ?? [])
    : props.value
      ? [props.value]
      : [];
  const selectedOptions = options.filter(option => selectedValues.includes(option.value));
  const displayLabel = props.multiple
    ? selectedOptions.length > 0
      ? selectedOptions.map(option => option.label).join(', ')
      : placeholder
    : (selectedOptions[0]?.label ?? placeholder);

  const filteredOptions = useMemo(
    () =>
      isSearchable && query.trim().length > 0
        ? options.filter(option => option.label.toLowerCase().includes(query.trim().toLowerCase()))
        : options,
    [options, isSearchable, query],
  );

  const handleSelect = (option: TSelectOption<TValue>) => {
    if (props.multiple) {
      const next = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];

      props.onChange(next);

      return;
    }

    props.onChange(option.value);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <Box>
      {label !== undefined && (
        <Text variant="label" color="textMuted" mb="s-1">
          {label}
        </Text>
      )}

      <Pressable
        onPress={() => !isDisabled && setIsOpen(true)}
        bg="background"
        borderColor={isInvalid ? 'error' : 'border'}
        borderWidth={1}
        rounded="r-2"
        px="s-3"
        py="s-3"
        style={{ opacity: isDisabled ? 0.5 : 1 }}
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, expanded: isOpen }}
      >
        <Row align="center" justify="space-between">
          <Text variant="body" color={selectedOptions.length > 0 ? 'text' : 'textMuted'}>
            {displayLabel}
          </Text>
          {Icon ? (
            <Row style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
              <Icon size={16} width={16} height={16} color={colors.textMuted} />
            </Row>
          ) : (
            <Text variant="label" color="textMuted">
              {isOpen ? '▲' : '▼'}
            </Text>
          )}
        </Row>
      </Pressable>

      {isInvalid && errorText !== undefined && (
        <Text variant="label" color="error" mt="s-1">
          {errorText}
        </Text>
      )}

      <Sheet
        isVisible={isOpen}
        onClose={handleClose}
        testID={testID ? `${testID}-sheet` : undefined}
      >
        {isSearchable && (
          <Box pb="s-3">
            <Input.Outline
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              startElement={
                SearchIcon ? (
                  <SearchIcon size={16} width={16} height={16} color={colors.textMuted} />
                ) : undefined
              }
              isClearable
              autoFocus
            />
          </Box>
        )}

        {filteredOptions.map(option => (
          <SelectOption
            key={option.value}
            label={option.label}
            isSelected={selectedValues.includes(option.value)}
            onPress={() => handleSelect(option)}
            selectedColor={selectedColor}
            checkIcon={checkIcon}
            testID={testID ? `${testID}-option-${option.value}` : undefined}
          />
        ))}
      </Sheet>
    </Box>
  );
};

export const Select = memo(SelectComponent) as typeof SelectComponent;
