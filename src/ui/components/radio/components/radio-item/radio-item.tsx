import React, { memo } from 'react';

import { Pressable } from '../../../../core/pressable';
import { useRadioContext } from '../../radio-context';
import { RadioIndicator } from '../radio-indicator';
import { RadioLabel } from '../radio-label';
import { TRadioItemProps } from './radio-item-types';

const RadioItemComponent: React.FC<TRadioItemProps> = ({ value, label, isDisabled }) => {
  const { selectedValue, onChange, color, isDisabled: rootDisabled, size } = useRadioContext();
  const disabled = isDisabled ?? rootDisabled;
  const isSelected = selectedValue === value;

  return (
    <Pressable
      onPress={() => !disabled && onChange(value)}
      disabled={disabled}
      direction="row"
      align="center"
      gap="s-2"
    >
      <RadioIndicator isSelected={isSelected} isDisabled={disabled} color={color} size={size} />
      {label && <RadioLabel label={label} isDisabled={disabled} />}
    </Pressable>
  );
};

export const RadioItem = memo(RadioItemComponent);
RadioItem.displayName = 'RadioItem';
