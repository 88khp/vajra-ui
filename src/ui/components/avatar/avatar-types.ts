import { ImageProps } from 'react-native';

import { TVajraColors } from '../../vajra-theme/colors';

export type TAvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export type TAvatarProps = {
  /** URI of the network image to display */
  src?: string;
  /** Initials to display when image fails to load */
  initials: string;
  /** Width of the avatar in pixels (default: 40) */
  width?: number;
  /** Height of the avatar in pixels (default: 40) */
  height?: number;
  /** Additional props forwarded to the underlying Image */
  imageProps?: Omit<ImageProps, 'source' | 'style'>;
  /** Presence indicator dot rendered at the bottom-right corner */
  status?: TAvatarStatus;
  /** Override the status dot's color token instead of using the default status→tone mapping */
  statusColor?: TVajraColors;
};
