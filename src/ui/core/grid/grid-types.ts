import { TGridColumns } from '@devraj-labs/vajra-ui-core';
import { TUiBoxProps } from '../box/box-types';

export type TUiGridRootProps = Omit<TUiBoxProps, 'direction' | 'wrap'>;

export type TUiGridItemProps = TUiBoxProps & {
  span?: TGridColumns;
  columns?: TGridColumns;
  colGap?: number;
  // Only used until the enclosing Grid.Root has been measured.
  screenPadding?: number;
};
