import { TVajraColors } from '../vajra-theme/colors';

export type TVajraTone = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// Re-points the accent tokens of a variant (`primary`, `primarySubtle`) at a tone.
// Any other color token passes through unchanged.
export const toneColor = (color: TVajraColors, tone: TVajraTone): TVajraColors => {
  if (color === 'primary') return tone;
  if (color === 'primarySubtle') return `${tone}Subtle` as TVajraColors;

  return color;
};
