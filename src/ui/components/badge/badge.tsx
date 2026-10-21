import React, { memo } from 'react';

import { Box } from '../../core/box';
import { Text } from '../../core/text';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { TBadgeProps } from './badge-types';

const BadgeComponent: React.FC<TBadgeProps> = ({
  label,
  textProps,
  icon: Icon,
  iconSize = 12,
  iconColor = 'textInverse',
  rounded = 'r-full',
  tone = 'primary',
  bg,
  px = 's-2',
  py = 's-1',
  ...rest
}) => {
  const { colors } = useVajraTheme();

  return (
    <Box
      rounded={rounded}
      bg={bg ?? tone}
      px={px}
      py={py}
      align="center"
      justify="center"
      direction="row"
      gap="s-1"
      {...rest}
    >
      {Icon && (
        <Icon size={iconSize} width={iconSize} height={iconSize} color={colors[iconColor]} />
      )}
      <Text variant="label" color="textInverse" {...textProps}>
        {label}
      </Text>
    </Box>
  );
};

export const Badge = memo(BadgeComponent);
Badge.displayName = 'Badge';
