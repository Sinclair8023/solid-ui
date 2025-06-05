import { JSX } from "solid-js";

export interface AffixProps {
  zIndex?: number;
  target?: string;
  offset?: number;
  position?: 'top' | 'bottom';
  onScroll?: (e: { scrollTop: number; fixed: boolean }) => void;
  onChange?: (fixed: boolean) => void;
  children?: JSX.Element
}
