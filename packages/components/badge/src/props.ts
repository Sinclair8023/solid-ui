import { JSX } from 'solid-js';

export interface BadgeProps extends JSX.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  max?: number;
  isDot?: boolean;
  hidden?: boolean;
  type?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
}
