import React, { memo, useCallback, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';

import { Box } from '../../core/box';
import { Row } from '../../core/row';
import { useVajraTheme } from '../../vajra-theme/use-vajra-theme';
import { TCarouselProps } from './carousel-types';

const CarouselComponent = <TItem,>({
  data,
  renderItem,
  keyExtractor,
  itemWidth,
  showIndicator = true,
  activeDotColor = 'primary',
  inactiveDotColor = 'border',
  onIndexChange,
  testID,
}: TCarouselProps<TItem>) => {
  const { colors } = useVajraTheme();
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const pageWidth = itemWidth ?? measuredWidth;

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => setMeasuredWidth(e.nativeEvent.layout.width),
    [],
  );

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (pageWidth <= 0) return;

      const index = Math.round(e.nativeEvent.contentOffset.x / pageWidth);

      setActiveIndex(prev => {
        if (prev === index) return prev;
        onIndexChange?.(index);

        return index;
      });
    },
    [pageWidth, onIndexChange],
  );

  return (
    <View testID={testID} onLayout={handleLayout}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {data.map((item, index) => (
          <Box
            key={keyExtractor ? keyExtractor(item, index) : index}
            style={pageWidth > 0 ? { width: pageWidth } : undefined}
          >
            {renderItem(item, index)}
          </Box>
        ))}
      </ScrollView>

      {showIndicator && data.length > 1 && (
        <Row align="center" justify="center" gap="s-2" pt="s-3">
          {data.map((item, index) => (
            <Box
              key={keyExtractor ? keyExtractor(item, index) : index}
              w={index === activeIndex ? 8 : 6}
              h={index === activeIndex ? 8 : 6}
              rounded="r-full"
              style={{
                backgroundColor: colors[index === activeIndex ? activeDotColor : inactiveDotColor],
              }}
            />
          ))}
        </Row>
      )}
    </View>
  );
};

export const Carousel = memo(CarouselComponent) as typeof CarouselComponent;
