import { JSX } from 'solid-js';

export interface DividerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  direction: 'horizontal' | 'vertical';
  contentPosition: 'left' | 'center' | 'right';
  borderStyle: JSX.CSSProperties['border-style'];
}
