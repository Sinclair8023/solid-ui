import { ComponentSize } from '@solid-ui/constants';
import { JSX } from 'solid-js';

export interface TagProps extends JSX.HTMLAttributes<unknown> {
  closable?: boolean;
  type?: 'success' | 'info' | 'warning' | 'danger' | '';
  hit?: boolean;
  disableTransitions?: boolean;
  color?: string;
  size?: ComponentSize;
  effect?: 'dark' | 'light' | 'plain';
  round?: boolean;
  onClose?: (e: MouseEvent) => void;
  onClick?: (e: MouseEvent) => void;
}
