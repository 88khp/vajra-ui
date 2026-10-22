import React, { memo } from 'react';

import { Box } from '../../../../core/box';
import { Col } from '../../../../core/col';
import { Pressable } from '../../../../core/pressable';
import { Row } from '../../../../core/row';
import { Text } from '../../../../core/text';
import { useVajraTheme } from '../../../../vajra-theme/use-vajra-theme';
import { DEFAULT_ICONS } from '../../../default-icons';
import { TOAST_VARIANT_COLORS, TOAST_VARIANT_ICONS } from '../../toast-constants';
import { TToastItemProps } from './toast-item-types';

const ToastItemComponent: React.FC<TToastItemProps> = ({
  message,
  variant = 'default',
  icon,
  dismissible = false,
  onDismiss,
  testID,
}) => {
  const { colors } = useVajraTheme();
  const { bg, text } = TOAST_VARIANT_COLORS[variant];
  const VariantIcon = TOAST_VARIANT_ICONS[variant];
  const DismissIcon = DEFAULT_ICONS.dismiss;
  const resolvedIcon =
    icon !== undefined
      ? icon
      : VariantIcon && <VariantIcon size={24} width={24} height={24} color={colors[text]} />;

  return (
    <Box testID={testID} bg={bg} rounded="r-3" px="s-4" py="s-3">
      <Row gap="s-2" align="center">
        {resolvedIcon}
        <Col flex={1}>
          <Text color={text} variant="bodyMedium">
            {message}
          </Text>
        </Col>
        {dismissible && (
          <Pressable
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            hitSlop={8}
            p="s-1"
            testID={testID ? `${testID}-dismiss` : undefined}
          >
            <DismissIcon size={20} width={20} height={20} color={colors[text]} />
          </Pressable>
        )}
      </Row>
    </Box>
  );
};

export const ToastItem = memo(ToastItemComponent);
ToastItem.displayName = 'ToastItem';
