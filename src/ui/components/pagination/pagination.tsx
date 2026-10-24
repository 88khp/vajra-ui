import React, { memo } from 'react';

import { Pressable } from '../../core/pressable';
import { Row } from '../../core/row';
import { Text } from '../../core/text';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { TPaginationProps } from './pagination-types';
import { ELLIPSIS, getPaginationRange } from './pagination-utils';

const PaginationComponent: React.FC<TPaginationProps> = ({
  page,
  pageCount,
  onChange,
  siblingCount = 1,
  activeColor = 'primary',
  inactiveColor = 'text',
  prevIcon: PrevIcon,
  nextIcon: NextIcon,
  testID,
}) => {
  const { colors } = useVajraTheme();
  const range = getPaginationRange(page, pageCount, siblingCount);

  const canGoPrev = page > 1;
  const canGoNext = page < pageCount;

  return (
    <Row align="center" gap="s-2" testID={testID}>
      <Pressable
        onPress={() => canGoPrev && onChange(page - 1)}
        disabled={!canGoPrev}
        accessibilityRole="button"
        accessibilityLabel="Previous page"
        p="s-1"
        style={{ opacity: canGoPrev ? 1 : 0.4 }}
      >
        {PrevIcon ? (
          <PrevIcon size={16} width={16} height={16} color={colors[inactiveColor]} />
        ) : (
          <Text variant="label" color={inactiveColor}>
            ‹
          </Text>
        )}
      </Pressable>

      {range.map((item, index) =>
        item === ELLIPSIS ? (
          <Text key={`ellipsis-${index}`} variant="label" color={inactiveColor}>
            {ELLIPSIS}
          </Text>
        ) : (
          <Pressable
            key={item}
            onPress={() => onChange(item)}
            accessibilityRole="button"
            accessibilityLabel={`Page ${item}`}
            accessibilityState={{ selected: item === page }}
            w={28}
            h={28}
            rounded="r-2"
            align="center"
            justify="center"
            bg={item === page ? activeColor : undefined}
          >
            <Text variant="label" color={item === page ? 'textInverse' : inactiveColor}>
              {item}
            </Text>
          </Pressable>
        ),
      )}

      <Pressable
        onPress={() => canGoNext && onChange(page + 1)}
        disabled={!canGoNext}
        accessibilityRole="button"
        accessibilityLabel="Next page"
        p="s-1"
        style={{ opacity: canGoNext ? 1 : 0.4 }}
      >
        {NextIcon ? (
          <NextIcon size={16} width={16} height={16} color={colors[inactiveColor]} />
        ) : (
          <Text variant="label" color={inactiveColor}>
            ›
          </Text>
        )}
      </Pressable>
    </Row>
  );
};

export const Pagination = memo(PaginationComponent);
Pagination.displayName = 'Pagination';
