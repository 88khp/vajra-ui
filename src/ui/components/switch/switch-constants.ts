import { TSwitchSize } from './switch-types';

export const SWITCH_SIZE_STYLES: Record<
  TSwitchSize,
  { trackW: number; trackH: number; thumb: number; thumbOffset: number }
> = {
  xs: { trackW: 32, trackH: 18, thumb: 14, thumbOffset: 2 },
  sm: { trackW: 38, trackH: 21, thumb: 16, thumbOffset: 2.5 },
  md: { trackW: 44, trackH: 24, thumb: 18, thumbOffset: 3 },
  lg: { trackW: 52, trackH: 28, thumb: 22, thumbOffset: 3 },
};
