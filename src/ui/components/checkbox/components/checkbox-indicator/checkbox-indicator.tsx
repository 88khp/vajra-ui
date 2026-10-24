import React, { memo } from 'react';

import { Center } from '../../../../core/center';
import { Text } from '../../../../core/text';
import { useVajraTheme } from '../../../../vajra-theme/use-vajra-theme';
import { TVajraColors } from '../../../../vajra-theme/colors';
import { TVajraIconComponent } from '../../../icon-button/icon-button-types';
import { CHECKBOX_SIZE_STYLES } from '../../checkbox-constants';
import { TCheckboxSize } from '../../checkbox-types';

type TCheckboxIndicatorProps = {
  isSelected: boolean;
  isDisabled: boolean;
  color?: TVajraColors;
  size?: TCheckboxSize;
  icon?: TVajraIconComponent;
};

const CheckboxIndicatorComponent: React.FC<TCheckboxIndicatorProps> = ({
  isSelected,
  isDisabled,
  color = 'primary',
  size = 'md',
  icon: Icon,
}) => {
  const { colors } = useVajraTheme();
  const { box, icon: iconSize } = CHECKBOX_SIZE_STYLES[size];

  return (
    <Center
      w={box}
      h={box}
      borderWidth={2}
      borderColor={isSelected ? color : 'border'}
      bg={isSelected ? color : 'transparent'}
      rounded="r-1"
      style={{ opacity: isDisabled ? 0.4 : 1 }}
    >
      {isSelected &&
        (Icon ? (
          <Icon size={iconSize} width={iconSize} height={iconSize} color={colors.textInverse} />
        ) : (
          <Text variant="label" color="textInverse" style={{ lineHeight: iconSize }}>
            ✓
          </Text>
        ))}
    </Center>
  );
};

export const CheckboxIndicator = memo(CheckboxIndicatorComponent);
CheckboxIndicator.displayName = 'CheckboxIndicator';
