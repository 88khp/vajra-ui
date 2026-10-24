import React, { memo } from 'react';

import { Pressable } from '../../core/pressable';
import { Spinner } from '../spinner';
import { Text } from '../../core/text';
import { toneColor } from '../../utils/tone';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { TButtonProps } from './button-types';
import { buttonRecipe } from './button-variants';

const ButtonComponent: React.FC<TButtonProps> = ({
  variant = 'solid',
  size = 'md',
  tone = 'primary',
  label,
  isDisabled = false,
  isLoading = false,
  isPill = false,
  loading,
  labelProps,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...rest
}) => {
  const { colors } = useVajraTheme();
  const { variant: v, size: s } = buttonRecipe({ variant, size });
  const container = { ...s.container, ...v.container };
  const labelStyle = { ...s.label, ...v.label };
  const backgroundColor = container.backgroundColor && toneColor(container.backgroundColor, tone);
  const borderColor = container.borderColor && toneColor(container.borderColor, tone);
  const labelColor = labelStyle.color && toneColor(labelStyle.color, tone);
  const iconColor = labelColor ?? colors.text;

  const loadingPosition = loading?.position ?? 'start';
  const isInteractionDisabled = isDisabled || isLoading;
  const displayLabel = isLoading && loading?.label ? loading.label : label;

  const spinner = loading?.loader ?? <Spinner color={labelColor} />;

  return (
    <Pressable
      disabled={isInteractionDisabled}
      bg={backgroundColor}
      borderColor={borderColor}
      borderWidth={container.borderWidth}
      px={container.px}
      py={container.py}
      rounded={isPill ? 'r-full' : container.rounded}
      style={isDisabled ? { opacity: 0.6 } : undefined}
      align="center"
      justify="center"
      direction="row"
      gap="s-2"
      {...rest}
    >
      {isLoading && loadingPosition === 'start' && spinner}
      {!isLoading && LeftIcon && (
        <LeftIcon size={s.icon.size} width={s.icon.size} height={s.icon.size} color={iconColor} />
      )}
      <Text variant={labelStyle.fontVariant} color={labelColor} {...labelProps}>
        {displayLabel}
      </Text>
      {!isLoading && RightIcon && (
        <RightIcon size={s.icon.size} width={s.icon.size} height={s.icon.size} color={iconColor} />
      )}
      {isLoading && loadingPosition === 'end' && spinner}
    </Pressable>
  );
};

export const Button = memo(ButtonComponent);
Button.displayName = 'Button';
