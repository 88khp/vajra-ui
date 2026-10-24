import React, { memo } from 'react';

import { Pressable } from '../../../../core/pressable';
import { useSwitchContext } from '../../switch-context';
import { SwitchIndicator } from '../switch-indicator';
import { SwitchLabel } from '../switch-label';
import { TSwitchItemProps } from './switch-item-types';

const SwitchItemComponent: React.FC<TSwitchItemProps> = ({ value, label, isDisabled }) => {
  const { selectedValue, onChange, color, isDisabled: rootDisabled, size } = useSwitchContext();
  const disabled = isDisabled ?? rootDisabled;
  const isSelected = selectedValue === value;

  return (
    <Pressable
      onPress={() => !disabled && onChange(value)}
      disabled={disabled}
      direction="row"
      align="center"
      justify="space-between"
      gap="s-2"
    >
      {label && <SwitchLabel label={label} isDisabled={disabled} />}
      <SwitchIndicator isSelected={isSelected} isDisabled={disabled} color={color} size={size} />
    </Pressable>
  );
};

export const SwitchItem = memo(SwitchItemComponent);
SwitchItem.displayName = 'SwitchItem';
