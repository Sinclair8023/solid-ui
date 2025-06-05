import { JSX } from 'solid-js';

export interface IconProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  icon: string;
  loading?: boolean;
  color?: string;
  rotate?: number;
  size?: number | string;
  style?: JSX.CSSProperties;
  class?: string;
}
