import React, { memo } from 'react';

import { Pressable } from '../../core/pressable';
import { Spinner } from '../spinner';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { TIconButtonProps } from './icon-button-types';
import { iconButtonRecipe } from './icon-button-variants';

const IconButtonComponent: React.FC<TIconButtonProps> = ({
  variant = 'solid',
  size = 'md',
  icon: Icon,
  iconColor,
  isDisabled = false,
  isLoading = false,
  isPill = false,
  loading,
  ...rest
}) => {
  const { colors } = useVajraTheme();
  const { variant: v, size: s } = iconButtonRecipe({ variant, size });
  const container = { ...s.container, ...v.container };
  const label = { ...v.label };

  const textColor = iconColor ? colors[iconColor] : label.color ? colors[label.color] : colors.text;

  const isInteractionDisabled = isDisabled || isLoading;

  const spinner = loading?.loader ?? <Spinner color={label.color} />;

  return (
    <Pressable
      disabled={isInteractionDisabled}
      bg={container.backgroundColor}
      rounded={isPill ? 'r-full' : container.rounded}
      style={[{ width: container.size, height: container.size, opacity: isDisabled ? 0.4 : 1 }]}
      align="center"
      justify="center"
      {...rest}
    >
      {isLoading ? (
        spinner
      ) : (
        <Icon size={s.icon.size} width={s.icon.size} height={s.icon.size} color={textColor} />
      )}
    </Pressable>
  );
};

export const IconButton = memo(IconButtonComponent);
IconButton.displayName = 'IconButton';
