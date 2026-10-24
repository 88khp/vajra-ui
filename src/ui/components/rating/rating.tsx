import React, { memo } from 'react';

import { Pressable } from '../../core/pressable';
import { Row } from '../../core/row';
import { Text } from '../../core/text';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { TRatingProps } from './rating-types';

const RatingComponent: React.FC<TRatingProps> = ({
  value,
  onChange,
  max = 5,
  isReadOnly = false,
  isDisabled = false,
  size = 24,
  color = 'warning',
  emptyColor = 'border',
  icon: Icon,
  emptyIcon: EmptyIcon,
  testID,
}) => {
  const { colors } = useVajraTheme();
  const cells = Array.from({ length: max }, (_, i) => i + 1);
  const canInteract = !isReadOnly && !isDisabled && onChange !== undefined;

  return (
    <Row gap="s-1" testID={testID} style={{ opacity: isDisabled ? 0.4 : 1 }}>
      {cells.map(cell => {
        const isFilled = cell <= value;
        const FilledIcon = Icon;
        const UnfilledIcon = EmptyIcon ?? Icon;

        const content = isFilled ? (
          FilledIcon ? (
            <FilledIcon size={size} width={size} height={size} color={colors[color]} />
          ) : (
            <Text style={{ fontSize: size, lineHeight: size, color: colors[color] }}>★</Text>
          )
        ) : UnfilledIcon ? (
          <UnfilledIcon size={size} width={size} height={size} color={colors[emptyColor]} />
        ) : (
          <Text style={{ fontSize: size, lineHeight: size, color: colors[emptyColor] }}>☆</Text>
        );

        if (!canInteract) {
          return <React.Fragment key={cell}>{content}</React.Fragment>;
        }

        return (
          <Pressable
            key={cell}
            onPress={() => onChange?.(cell)}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${cell} out of ${max}`}
            hitSlop={4}
          >
            {content}
          </Pressable>
        );
      })}
    </Row>
  );
};

export const Rating = memo(RatingComponent);
Rating.displayName = 'Rating';
