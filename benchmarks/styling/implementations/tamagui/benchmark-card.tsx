/**
 * Tamagui implementation.
 *
 * Layout and colors use Tamagui tokens ($surface, $primary, $s4, $r3). Variants use
 * Tamagui's `variants` API, which is the documented way to express variant styling.
 * Pressables use styled(Pressable) so that the host tree matches the other
 * implementations (Pressable > Text).
 */
import React, { memo } from 'react';
import { Pressable, View } from 'react-native';
import { styled, TamaguiProvider, Text, Theme, YStack } from 'tamagui';

import {
  accessibilityFor,
  COPY,
  renderCounter,
  TBenchCardProps,
  TBenchTheme,
} from '../../shared/spec';
import { tamaguiConfig } from './config';

const Card = styled(YStack, {
  padding: '$s4',
  gap: '$s3',
  borderRadius: '$r3',
  borderWidth: 1,
  backgroundColor: '$surface',
  variants: {
    variant: {
      primary: { borderColor: '$primary' },
      secondary: { borderColor: '$secondary' },
      danger: { borderColor: '$error' },
    },
  } as const,
});

const HeaderRow = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Title = styled(Text, {
  fontSize: '$title',
  lineHeight: '$title',
  fontWeight: '$title',
  color: '$text',
});

const Description = styled(Text, {
  fontSize: '$body',
  lineHeight: '$body',
  fontWeight: '$body',
  color: '$textSubtle',
});

const Status = styled(View, {
  width: 8,
  height: 8,
  borderRadius: '$rfull',
  variants: {
    variant: {
      primary: { backgroundColor: '$primary' },
      secondary: { backgroundColor: '$secondary' },
      danger: { backgroundColor: '$error' },
    },
  } as const,
});

const ActionRow = styled(View, {
  flexDirection: 'row',
  gap: '$s2',
});

const PrimaryButton = styled(Pressable, {
  paddingHorizontal: '$s4',
  paddingVertical: 8,
  borderRadius: '$r2',
  borderWidth: 1,
  variants: {
    variant: {
      primary: { backgroundColor: '$primary', borderColor: '$primary' },
      secondary: { backgroundColor: '$secondary', borderColor: '$secondary' },
      danger: { backgroundColor: '$error', borderColor: '$error' },
    },
  } as const,
});

const SecondaryButton = styled(Pressable, {
  paddingHorizontal: '$s4',
  paddingVertical: 8,
  borderRadius: '$r2',
  borderWidth: 1,
  backgroundColor: '$surfaceRaised',
  borderColor: '$border',
});

const PrimaryLabel = styled(Text, {
  fontSize: '$button',
  lineHeight: '$button',
  fontWeight: '$button',
  color: '$textInverse',
});

const SecondaryLabel = styled(Text, {
  fontSize: '$button',
  lineHeight: '$button',
  fontWeight: '$button',
  color: '$text',
});

export const Provider = ({ theme, children }: { theme: TBenchTheme; children: React.ReactNode }) => (
  <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
    <Theme name={theme}>{children}</Theme>
  </TamaguiProvider>
);

const BenchmarkCardComponent = ({
  title,
  description,
  variant,
  onPrimaryPress,
  onSecondaryPress,
}: TBenchCardProps) => {
  renderCounter.count += 1;
  const a11y = accessibilityFor(title);

  return (
    <Card variant={variant}>
      <HeaderRow>
        <Title>{title}</Title>
        <Status
          variant={variant}
          accessibilityRole={a11y.status.role}
          accessibilityLabel={a11y.status.label}
        />
      </HeaderRow>
      <Description>{description}</Description>
      <ActionRow>
        <PrimaryButton
          variant={variant}
          accessibilityRole={a11y.primary.role}
          accessibilityLabel={a11y.primary.label}
          onPress={onPrimaryPress}
        >
          <PrimaryLabel>{COPY.primaryLabel}</PrimaryLabel>
        </PrimaryButton>
        <SecondaryButton
          accessibilityRole={a11y.secondary.role}
          accessibilityLabel={a11y.secondary.label}
          onPress={onSecondaryPress}
        >
          <SecondaryLabel>{COPY.secondaryLabel}</SecondaryLabel>
        </SecondaryButton>
      </ActionRow>
    </Card>
  );
};

export const BenchmarkCard = memo(BenchmarkCardComponent);
BenchmarkCard.displayName = 'BenchmarkCard';
