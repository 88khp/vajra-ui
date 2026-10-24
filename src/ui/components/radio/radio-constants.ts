import { TRadioSize } from './radio-types';

export const RADIO_SIZE_STYLES: Record<TRadioSize, { box: number; dot: number }> = {
  xs: { box: 14, dot: 7 },
  sm: { box: 17, dot: 8 },
  md: { box: 20, dot: 10 },
  lg: { box: 24, dot: 12 },
};
