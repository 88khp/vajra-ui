import React, { memo } from 'react';

import { Pressable } from '../../core/pressable';
import { SwitchRoot } from './switch-root';
import { SwitchItem } from './components/switch-item';
import { SwitchIndicator } from './components/switch-indicator';
import { SwitchLabel } from './components/switch-label';
import { TSwitchProps } from './switch-types';

// Standalone on/off toggle. Use Switch.Root + Switch.Item for a single-select group.
const SwitchToggle = memo<TSwitchProps>(
  ({ value, onChange, label, color, isDisabled = false, size = 'md' }) => (
    <Pressable
      onPress={() => !isDisabled && onChange(!value)}
      disabled={isDisabled}
      direction="row"
      align="center"
      justify="space-between"
      gap="s-2"
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: isDisabled }}
    >
      {label && <SwitchLabel label={label} isDisabled={isDisabled} />}
      <SwitchIndicator isSelected={value} isDisabled={isDisabled} color={color} size={size} />
    </Pressable>
  ),
);

SwitchToggle.displayName = 'Switch';

export const Switch = Object.assign(SwitchToggle, {
  Root: SwitchRoot,
  Item: SwitchItem,
  Indicator: SwitchIndicator,
  Label: SwitchLabel,
});
