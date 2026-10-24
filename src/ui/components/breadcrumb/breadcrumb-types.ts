import { TVajraColors } from '../../vajra-theme/colors';

export type TBreadcrumbItem = {
  label: string;
  /** Omit onPress on the last item to render it as the current, non-interactive page. */
  onPress?: () => void;
};

export type TBreadcrumbProps = {
  items: TBreadcrumbItem[];
  /** Separator rendered between items. Defaults to '/'. */
  separator?: string;
  activeColor?: TVajraColors;
  inactiveColor?: TVajraColors;
  separatorColor?: TVajraColors;
  testID?: string;
};
