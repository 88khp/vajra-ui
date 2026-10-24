import React, { memo } from 'react';

import { Pressable } from '../../../../core/pressable';
import { useCheckboxContext } from '../../checkbox-context';
import { CheckboxIndicator } from '../checkbox-indicator';
import { CheckboxLabel } from '../checkbox-label';
import { TCheckboxItemProps } from './checkbox-item-types';

const CheckboxItemComponent: React.FC<TCheckboxItemProps> = ({ value, label, isDisabled }) => {
  const {
    selectedValues,
    onChange,
    color,
    isDisabled: rootDisabled,
    size,
    icon,
  } = useCheckboxContext();
  const disabled = isDisabled ?? rootDisabled;
  const isSelected = selectedValues.includes(value);

  return (
    <Pressable
      onPress={() => !disabled && onChange(value)}
      disabled={disabled}
      direction="row"
      align="center"
      gap="s-2"
    >
      <CheckboxIndicator
        isSelected={isSelected}
        isDisabled={disabled}
        color={color}
        size={size}
        icon={icon}
      />
      {label && <CheckboxLabel label={label} isDisabled={disabled} />}
    </Pressable>
  );
};

export const CheckboxItem = memo(CheckboxItemComponent);
CheckboxItem.displayName = 'CheckboxItem';
