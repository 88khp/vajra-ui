import { TInputProps } from '../input';
import { TVajraIconComponent } from '../icon-button';

export type TSearchbarProps = Omit<TInputProps, 'startElement' | 'isClearable'> & {
  /** Icon shown at the leading edge. Defaults to a plain 🔍 glyph. */
  icon?: TVajraIconComponent;
  /** Debounce (ms) applied to onChangeText. 0 disables debouncing (default). */
  debounceMs?: number;
};
