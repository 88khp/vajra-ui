import React, { memo } from 'react';

import { Center } from '../../../../core/center';
import { Box } from '../../../../core/box';
import { useVajraTheme } from '../../../../vajra-theme/use-vajra-theme';
import { TVajraColors } from '../../../../vajra-theme/colors';
import { RADIO_SIZE_STYLES } from '../../radio-constants';
import { TRadioSize } from '../../radio-types';

type TRadioIndicatorProps = {
  isSelected: boolean;
  isDisabled: boolean;
  color?: TVajraColors;
  size?: TRadioSize;
};

const RadioIndicatorComponent: React.FC<TRadioIndicatorProps> = ({
  isSelected,
  isDisabled,
  color = 'primary',
  size = 'md',
}) => {
  const { colors } = useVajraTheme();
  const { box, dot } = RADIO_SIZE_STYLES[size];

  return (
    <Center
      w={box}
      h={box}
      borderWidth={2}
      borderColor={isSelected ? color : 'border'}
      rounded="r-full"
      style={{ opacity: isDisabled ? 0.4 : 1 }}
    >
      {isSelected && (
        <Box w={dot} h={dot} rounded="r-full" style={{ backgroundColor: colors[color] }} />
      )}
    </Center>
  );
};

export const RadioIndicator = memo(RadioIndicatorComponent);
RadioIndicator.displayName = 'RadioIndicator';
