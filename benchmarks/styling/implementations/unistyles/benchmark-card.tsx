/**
 * Unistyles 3 implementation.
 *
 * Styles are created with StyleSheet.create, which accepts a theme callback. Variants
 * are declared inside the stylesheet and selected with styles.useVariants(). Theme
 * switching calls UnistylesRuntime.setTheme, which updates the native layer directly.
 *
 * NOTE: Unistyles 3 requires its native module (Nitro + Reanimated). It cannot run
 * under the Jest harness used for the other implementations. Its numbers are only
 * meaningful from a simulator or device build.
 */
import React, { memo, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

import './config';
import {
  accessibilityFor,
  COPY,
  renderCounter,
  TBenchCardProps,
  TBenchTheme,
} from '../../shared/spec';

const stylesheet = StyleSheet.create(theme => ({
  card: {
    padding: theme.sizes.cardPadding,
    gap: theme.sizes.cardGap,
    borderRadius: theme.sizes.cardRadius,
    borderWidth: theme.sizes.cardBorderWidth,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    variants: {
      variant: {
        primary: { borderColor: theme.colors.primary },
        secondary: { borderColor: theme.colors.secondary },
        danger: { borderColor: theme.colors.error },
      },
    },
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title.fontSize,
    lineHeight: theme.typography.title.lineHeight,
    fontWeight: theme.typography.title.fontWeight,
  },
  status: {
    width: theme.sizes.statusSize,
    height: theme.sizes.statusSize,
    borderRadius: theme.sizes.statusRadius,
    backgroundColor: theme.colors.primary,
    variants: {
      variant: {
        primary: { backgroundColor: theme.colors.primary },
        secondary: { backgroundColor: theme.colors.secondary },
        danger: { backgroundColor: theme.colors.error },
      },
    },
  },
  description: {
    color: theme.colors.textSubtle,
    fontSize: theme.typography.description.fontSize,
    lineHeight: theme.typography.description.lineHeight,
    fontWeight: theme.typography.description.fontWeight,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.sizes.actionGap,
  },
  primaryButton: {
    paddingHorizontal: theme.sizes.buttonPaddingX,
    paddingVertical: theme.sizes.buttonPaddingY,
    borderRadius: theme.sizes.buttonRadius,
    borderWidth: theme.sizes.cardBorderWidth,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    variants: {
      variant: {
        primary: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
        secondary: { backgroundColor: theme.colors.secondary, borderColor: theme.colors.secondary },
        danger: { backgroundColor: theme.colors.error, borderColor: theme.colors.error },
      },
    },
  },
  primaryLabel: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.button.fontSize,
    lineHeight: theme.typography.button.lineHeight,
    fontWeight: theme.typography.button.fontWeight,
  },
  secondaryButton: {
    paddingHorizontal: theme.sizes.buttonPaddingX,
    paddingVertical: theme.sizes.buttonPaddingY,
    borderRadius: theme.sizes.buttonRadius,
    borderWidth: theme.sizes.cardBorderWidth,
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.border,
  },
  secondaryLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.button.fontSize,
    lineHeight: theme.typography.button.lineHeight,
    fontWeight: theme.typography.button.fontWeight,
  },
}));

/** Unistyles' theme is native and global, so the provider sets it instead of passing props. */
export const Provider = ({ theme, children }: { theme: TBenchTheme; children: React.ReactNode }) => {
  useEffect(() => {
    UnistylesRuntime.setTheme(theme);
  }, [theme]);

  return <>{children}</>;
};

const BenchmarkCardComponent = ({
  title,
  description,
  variant,
  onPrimaryPress,
  onSecondaryPress,
}: TBenchCardProps) => {
  renderCounter.count += 1;
  const styles = stylesheet;
  styles.useVariants({ variant });
  const a11y = accessibilityFor(title);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <View
          accessibilityRole={a11y.status.role}
          accessibilityLabel={a11y.status.label}
          style={styles.status}
        />
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole={a11y.primary.role}
          accessibilityLabel={a11y.primary.label}
          onPress={onPrimaryPress}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryLabel}>{COPY.primaryLabel}</Text>
        </Pressable>
        <Pressable
          accessibilityRole={a11y.secondary.role}
          accessibilityLabel={a11y.secondary.label}
          onPress={onSecondaryPress}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryLabel}>{COPY.secondaryLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export const BenchmarkCard = memo(BenchmarkCardComponent);
BenchmarkCard.displayName = 'BenchmarkCard';
