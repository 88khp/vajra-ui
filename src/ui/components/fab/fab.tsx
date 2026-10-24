import React, { memo } from 'react';
import { ViewStyle } from 'react-native';

import { Pressable } from '../../core/pressable';
import { Text } from '../../core/text';
import { toneColor } from '../../utils/tone';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { iconButtonRecipe } from '../icon-button/icon-button-variants';
import { TFabPosition, TFabProps } from './fab-types';

const getPositionStyle = (position: TFabPosition, offset: number): ViewStyle => {
  switch (position) {
    case 'bottomRight':
      return { position: 'absolute', bottom: offset, right: offset };
    case 'bottomLeft':
      return { position: 'absolute', bottom: offset, left: offset };
    case 'topRight':
      return { position: 'absolute', top: offset, right: offset };
    case 'topLeft':
      return { position: 'absolute', top: offset, left: offset };
  }
};

const FabComponent: React.FC<TFabProps> = ({
  icon: Icon,
  label,
  variant = 'solid',
  size = 'lg',
  isDisabled = false,
  position,
  offset = 16,
  style,
  ...rest
}) => {
  const { colors } = useVajraTheme();
  const { variant: v, size: s } = iconButtonRecipe({ variant, size });
  const container = { ...s.container, ...v.container };
  const labelStyle = { ...v.label };

  const backgroundColor =
    container.backgroundColor && toneColor(container.backgroundColor, 'primary');
  const labelColor = labelStyle.color
    ? colors[toneColor(labelStyle.color, 'primary')]
    : colors.text;

  const sizeStyle: ViewStyle = label
    ? { height: container.size, opacity: isDisabled ? 0.4 : 1 }
    : { width: container.size, height: container.size, opacity: isDisabled ? 0.4 : 1 };

  const shadowStyle: ViewStyle = {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  };

  const extraStyles = Array.isArray(style) ? style : style ? [style] : [];
  const combinedStyle: ViewStyle[] = [
    sizeStyle,
    shadowStyle,
    ...(position ? [getPositionStyle(position, offset)] : []),
    ...extraStyles,
  ];

  return (
    <Pressable
      disabled={isDisabled}
      bg={backgroundColor}
      rounded={label ? 'r-full' : container.rounded}
      direction="row"
      align="center"
      justify="center"
      gap="s-2"
      px={label ? 's-5' : undefined}
      style={combinedStyle}
      {...rest}
    >
      <Icon size={s.icon.size} width={s.icon.size} height={s.icon.size} color={labelColor} />
      {label && (
        <Text variant="button" color={toneColor(labelStyle.color ?? 'text', 'primary')}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export const Fab = memo(FabComponent);
Fab.displayName = 'Fab';
