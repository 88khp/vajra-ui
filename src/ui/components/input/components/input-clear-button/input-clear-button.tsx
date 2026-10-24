import React, { memo } from 'react';

import { Pressable } from '../../../../core/pressable';
import { Text } from '../../../../core/text';
import { useVajraTheme } from '../../../../vajra-theme/use-vajra-theme';
import { TInputClearButtonProps } from './input-clear-button-types';

const InputClearButtonComponent: React.FC<TInputClearButtonProps> = ({ icon: Icon, onPress }) => {
  const { colors } = useVajraTheme();

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Clear">
      {Icon ? (
        <Icon size={16} width={16} height={16} color={colors.textMuted} />
      ) : (
        <Text variant="label" color="textMuted">
          ✕
        </Text>
      )}
    </Pressable>
  );
};

export const InputClearButton = memo(InputClearButtonComponent);
InputClearButton.displayName = 'InputClearButton';
