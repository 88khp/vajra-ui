export const AVATAR_PALETTE: { bg: string; text: string }[] = [
  { bg: '#E57373', text: '#FFFFFF' },
  { bg: '#F06292', text: '#FFFFFF' },
  { bg: '#BA68C8', text: '#FFFFFF' },
  { bg: '#7986CB', text: '#FFFFFF' },
  { bg: '#4FC3F7', text: '#000000' },
  { bg: '#4DB6AC', text: '#000000' },
  { bg: '#81C784', text: '#000000' },
  { bg: '#FFD54F', text: '#000000' },
  { bg: '#FF8A65', text: '#FFFFFF' },
  { bg: '#A1887F', text: '#FFFFFF' },
];

export const AVATAR_LOADING_BG = '#D1D5DB';

export const AVATAR_DEFAULT_SIZE = 40;

export const AVATAR_STATUS_COLOR_TOKENS = {
  online: 'success',
  busy: 'error',
  away: 'warning',
  offline: 'textMuted',
} as const;
