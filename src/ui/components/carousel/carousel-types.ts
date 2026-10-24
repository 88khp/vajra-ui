import React from 'react';

import { TVajraColors } from '../../vajra-theme/colors';

export type TCarouselProps<TItem> = {
  data: TItem[];
  renderItem: (item: TItem, index: number) => React.ReactNode;
  keyExtractor?: (item: TItem, index: number) => string;

  /** Width of each page. Defaults to the carousel's own measured width (full-bleed paging). */
  itemWidth?: number;

  /** Shows the dot-page indicator below the carousel. Defaults to true. */
  showIndicator?: boolean;
  activeDotColor?: TVajraColors;
  inactiveDotColor?: TVajraColors;

  onIndexChange?: (index: number) => void;

  testID?: string;
};
