import { TVajraColors } from '../../vajra-theme/colors';
import { TVajraIconComponent } from '../icon-button/icon-button-types';

export type TPaginationProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;

  /** How many page numbers to show around the current page. Defaults to 1. */
  siblingCount?: number;

  activeColor?: TVajraColors;
  inactiveColor?: TVajraColors;

  /** Icon for the previous-page control. Defaults to a plain ‹ glyph. */
  prevIcon?: TVajraIconComponent;
  /** Icon for the next-page control. Defaults to a plain › glyph. */
  nextIcon?: TVajraIconComponent;

  testID?: string;
};
