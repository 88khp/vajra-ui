import React, { memo } from 'react';

import { ALERT_VARIANT_COLORS, ALERT_VARIANT_ICONS } from '../alert';
import { Box } from '../../core/box';
import { Col } from '../../core/col';
import { Pressable } from '../../core/pressable';
import { Row } from '../../core/row';
import { Text } from '../../core/text';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { DEFAULT_ICONS } from '../default-icons';
import { TBannerProps } from './banner-types';

// Page-level, full-width, square-cornered message bar — distinct from Alert
// (inline, rounded, meant to sit within content) and Toast (ephemeral, floating).
const BannerComponent: React.FC<TBannerProps> = ({
  message,
  title,
  variant = 'default',
  onDismiss,
  icon,
  dismissIcon: DismissIcon = DEFAULT_ICONS.dismiss,
  action,
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
      borderBottomWidth={1}
      px="s-4"
      py="s-3"
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
        {action && (
          <Pressable onPress={action.onPress} accessibilityRole="button" p="s-1">
            <Text variant="bodyMedium" color={text} style={{ textDecorationLine: 'underline' }}>
              {action.label}
            </Text>
          </Pressable>
        )}
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

export const Banner = memo(BannerComponent);
Banner.displayName = 'Banner';
