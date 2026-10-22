import React, { memo } from 'react';

import { Box } from '../../core/box';
import { Col } from '../../core/col';
import { Pressable } from '../../core/pressable';
import { Row } from '../../core/row';
import { Text } from '../../core/text';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { DEFAULT_ICONS } from '../default-icons';
import { ALERT_VARIANT_COLORS, ALERT_VARIANT_ICONS } from './alert-constants';
import { TAlertProps } from './alert-types';

const AlertComponent: React.FC<TAlertProps> = ({
  message,
  title,
  variant = 'default',
  onDismiss,
  icon,
  dismissIcon: DismissIcon = DEFAULT_ICONS.dismiss,
  testID,
}) => {
  const { colors } = useVajraTheme();
  const { bg, border, text } = ALERT_VARIANT_COLORS[variant];
  const VariantIcon = ALERT_VARIANT_ICONS[variant];
  const resolvedIcon =
    icon !== undefined
      ? icon
      : VariantIcon && <VariantIcon size={20} width={20} height={20} color={colors[text]} />;

  return (
    <Box
      bg={bg}
      borderColor={border}
      borderWidth={1}
      rounded="r-3"
      p="s-3"
      testID={testID}
      accessibilityRole="alert"
    >
      <Row gap="s-2" align="center">
        {resolvedIcon}
        <Col flex={1} gap="s-1">
          {title !== undefined && (
            <Text variant="bodyMedium" color={text}>
              {title}
            </Text>
          )}
          <Text variant="bodySmall" color={text}>
            {message}
          </Text>
        </Col>
        {onDismiss !== undefined && (
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

export const Alert = memo(AlertComponent);
Alert.displayName = 'Alert';
