import React, { memo, useState } from 'react';

import { Box } from '../../core/box';
import { Pressable } from '../../core/pressable';
import { Row } from '../../core/row';
import { Text } from '../../core/text';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { Sheet } from '../sheet';
import { DatePickerCalendar } from './components/date-picker-calendar';
import { formatDate } from './date-picker-utils';
import { TDatePickerProps } from './date-picker-types';

const DatePickerComponent: React.FC<TDatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select a date…',
  label,
  errorText,
  isInvalid = false,
  isDisabled = false,
  formatValue = formatDate,
  selectedColor = 'primary',
  icon: Icon,
  prevIcon,
  nextIcon,
  testID,
}) => {
  const { colors } = useVajraTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date: Date) => {
    onChange(date);
    setIsOpen(false);
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
          <Text variant="body" color={value ? 'text' : 'textMuted'}>
            {value ? formatValue(value) : placeholder}
          </Text>
          {Icon ? (
            <Icon size={16} width={16} height={16} color={colors.textMuted} />
          ) : (
            <Text variant="label" color="textMuted">
              📅
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
        onClose={() => setIsOpen(false)}
        testID={testID ? `${testID}-sheet` : undefined}
      >
        <DatePickerCalendar
          value={value}
          onSelect={handleSelect}
          minDate={minDate}
          maxDate={maxDate}
          selectedColor={selectedColor}
          prevIcon={prevIcon}
          nextIcon={nextIcon}
        />
      </Sheet>
    </Box>
  );
};

export const DatePicker = memo(DatePickerComponent);
DatePicker.displayName = 'DatePicker';
