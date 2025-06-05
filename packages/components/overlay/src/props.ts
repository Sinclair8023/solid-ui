import { JSX } from 'solid-js';

export interface OverlayProps extends JSX.HTMLAttributes<HTMLDivElement> {
  mask?: boolean;
  class?: string;
  zIndex: number;
}
