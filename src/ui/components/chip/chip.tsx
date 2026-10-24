import React, { memo } from 'react';

import { Box } from '../../core/box';
import { Pressable } from '../../core/pressable';
import { Text } from '../../core/text';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { TChipProps } from './chip-types';

const ChipComponent: React.FC<TChipProps> = ({
  label,
  isSelected = false,
  onPress,
  onRemove,
  isDisabled = false,
  selectedBg = 'primary',
  selectedColor = 'textInverse',
  unselectedBg = 'surfaceRaised',
  unselectedColor = 'text',
  icon: Icon,
  avatar,
  removeIcon: RemoveIcon,
  testID,
}) => {
  const { colors } = useVajraTheme();
  const bg = isSelected ? selectedBg : unselectedBg;
  const color = isSelected ? selectedColor : unselectedColor;

  const content = (
    <Box
      bg={bg}
      rounded="r-full"
      px="s-3"
      py="s-1"
      direction="row"
      align="center"
      gap="s-1"
      style={{ opacity: isDisabled ? 0.5 : 1 }}
      testID={testID}
    >
      {avatar}
      {!avatar && Icon && <Icon size={14} width={14} height={14} color={colors[color]} />}
      <Text variant="label" color={color}>
        {label}
      </Text>
      {onRemove !== undefined && (
        <Pressable
          onPress={() => !isDisabled && onRemove()}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          testID={testID ? `${testID}-remove` : undefined}
        >
          {RemoveIcon ? (
            <RemoveIcon size={14} width={14} height={14} color={colors[color]} />
          ) : (
            <Text variant="label" color={color}>
              ✕
            </Text>
          )}
        </Pressable>
      )}
    </Box>
  );

  if (onPress === undefined) return content;

  return (
    <Pressable
      onPress={() => !isDisabled && onPress()}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
    >
      {content}
    </Pressable>
  );
};

export const Chip = memo(ChipComponent);
Chip.displayName = 'Chip';
