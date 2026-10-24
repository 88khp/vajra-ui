import React, { memo, useState } from 'react';

import { Box } from '../../../../core/box';
import { Pressable } from '../../../../core/pressable';
import { Row } from '../../../../core/row';
import { Text } from '../../../../core/text';
import { useVajraTheme } from '../../../../vajra-theme/use-vajra-theme';
import {
  addMonths,
  getCalendarGrid,
  isAfterDay,
  isBeforeDay,
  isSameDay,
  MONTH_LABELS,
  WEEKDAY_LABELS,
} from '../../date-picker-utils';
import { TDatePickerCalendarProps } from './date-picker-calendar-types';

const CELL_SIZE = 36;

const DatePickerCalendarComponent: React.FC<TDatePickerCalendarProps> = ({
  value,
  onSelect,
  minDate,
  maxDate,
  selectedColor = 'primary',
  prevIcon: PrevIcon,
  nextIcon: NextIcon,
}) => {
  const { colors } = useVajraTheme();
  const [visibleMonth, setVisibleMonth] = useState(() => value ?? new Date());
  const grid = getCalendarGrid(visibleMonth);

  const isDisabledDate = (date: Date) =>
    (minDate && isBeforeDay(date, minDate)) || (maxDate && isAfterDay(date, maxDate));

  return (
    <Box>
      <Row align="center" justify="space-between" mb="s-3">
        <Pressable
          onPress={() => setVisibleMonth(prev => addMonths(prev, -1))}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          p="s-1"
        >
          {PrevIcon ? (
            <PrevIcon size={18} width={18} height={18} color={colors.text} />
          ) : (
            <Text variant="body" color="text">
              ‹
            </Text>
          )}
        </Pressable>

        <Text variant="bodyMedium" color="text">
          {MONTH_LABELS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
        </Text>

        <Pressable
          onPress={() => setVisibleMonth(prev => addMonths(prev, 1))}
          accessibilityRole="button"
          accessibilityLabel="Next month"
          p="s-1"
        >
          {NextIcon ? (
            <NextIcon size={18} width={18} height={18} color={colors.text} />
          ) : (
            <Text variant="body" color="text">
              ›
            </Text>
          )}
        </Pressable>
      </Row>

      <Row>
        {WEEKDAY_LABELS.map((label, i) => (
          <Box key={`${label}-${i}`} w={CELL_SIZE} align="center" justify="center">
            <Text variant="label" color="textMuted">
              {label}
            </Text>
          </Box>
        ))}
      </Row>

      <Box direction="row" style={{ flexWrap: 'wrap' }}>
        {grid.map(cell => {
          const isSelected = value !== undefined && isSameDay(cell.date, value);
          const isDisabled = isDisabledDate(cell.date);
          const isToday = isSameDay(cell.date, new Date());

          return (
            <Pressable
              key={cell.date.toISOString()}
              onPress={() => !isDisabled && onSelect(cell.date)}
              disabled={isDisabled}
              w={CELL_SIZE}
              h={CELL_SIZE}
              align="center"
              justify="center"
              rounded="r-full"
              bg={isSelected ? selectedColor : undefined}
              style={{
                opacity: !cell.isCurrentMonth || isDisabled ? 0.35 : 1,
              }}
              accessibilityRole="button"
              accessibilityLabel={cell.date.toDateString()}
              accessibilityState={{ selected: isSelected, disabled: isDisabled }}
            >
              <Text
                variant="body"
                color={isSelected ? 'textInverse' : isToday ? selectedColor : 'text'}
              >
                {cell.date.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </Box>
    </Box>
  );
};

export const DatePickerCalendar = memo(DatePickerCalendarComponent);
DatePickerCalendar.displayName = 'DatePickerCalendar';
