/**
 * Vajra UI implementation, using only the public API:
 * VajraProvider, Box, Text, Pressable and createRecipe.
 *
 * Variants are a createRecipe. Because the recipe is pure, its output for each
 * variant is computed once at module load. Token names (bg, borderColor, rounded,
 * p, gap) are resolved against the theme by Box/Text/Pressable during render,
 * which is Vajra's intended runtime path.
 */
import React, { memo } from 'react';
import { Box, createRecipe, Pressable, Text, VajraProvider } from '@88khp/vajra-ui';

import {
  accessibilityFor,
  COPY,
  renderCounter,
  TBenchCardProps,
  TBenchTheme,
  TBenchVariant,
} from '../../shared/spec';

const cardRecipe = createRecipe({
  variants: {
    variant: {
      primary: {
        card: { borderColor: 'primary' },
        primaryButton: { bg: 'primary', borderColor: 'primary' },
        status: { bg: 'primary' },
      },
      secondary: {
        card: { borderColor: 'secondary' },
        primaryButton: { bg: 'secondary', borderColor: 'secondary' },
        status: { bg: 'secondary' },
      },
      danger: {
        card: { borderColor: 'error' },
        primaryButton: { bg: 'error', borderColor: 'error' },
        status: { bg: 'error' },
      },
    },
  },
} as const);

/** Precomputed once per variant (the recipe is pure). */
const SLOTS: Record<TBenchVariant, ReturnType<typeof cardRecipe>['variant']> = {
  primary: cardRecipe({ variant: 'primary' }).variant,
  secondary: cardRecipe({ variant: 'secondary' }).variant,
  danger: cardRecipe({ variant: 'danger' }).variant,
};

export const Provider = ({ theme, children }: { theme: TBenchTheme; children: React.ReactNode }) => (
  <VajraProvider colorScheme={theme}>{children}</VajraProvider>
);

const BenchmarkCardComponent = ({
  title,
  description,
  variant,
  onPrimaryPress,
  onSecondaryPress,
}: TBenchCardProps) => {
  renderCounter.count += 1;
  const slots = SLOTS[variant];
  const a11y = accessibilityFor(title);

  return (
    <Box
      p="s-4"
      gap="s-3"
      rounded="r-3"
      bg="surface"
      borderWidth={1}
      borderColor={slots.card.borderColor}
    >
      <Box direction="row" justify="space-between" align="center">
        <Text variant="h3" color="text">
          {title}
        </Text>
        <Box
          accessibilityRole={a11y.status.role}
          accessibilityLabel={a11y.status.label}
          w={8}
          h={8}
          rounded="r-full"
          bg={slots.status.bg}
        />
      </Box>
      <Text variant="body" color="textSubtle">
        {description}
      </Text>
      <Box direction="row" gap="s-2">
        <Pressable
          accessibilityRole={a11y.primary.role}
          accessibilityLabel={a11y.primary.label}
          onPress={onPrimaryPress}
          px="s-4"
          py="s-2"
          rounded="r-2"
          borderWidth={1}
          bg={slots.primaryButton.bg}
          borderColor={slots.primaryButton.borderColor}
        >
          <Text variant="button" color="textInverse">
            {COPY.primaryLabel}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole={a11y.secondary.role}
          accessibilityLabel={a11y.secondary.label}
          onPress={onSecondaryPress}
          px="s-4"
          py="s-2"
          rounded="r-2"
          borderWidth={1}
          bg="surfaceRaised"
          borderColor="border"
        >
          <Text variant="button" color="text">
            {COPY.secondaryLabel}
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
};

export const BenchmarkCard = memo(BenchmarkCardComponent);
BenchmarkCard.displayName = 'BenchmarkCard';
