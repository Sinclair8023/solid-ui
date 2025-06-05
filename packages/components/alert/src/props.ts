import { JSX } from "solid-js";

export interface AlertProps {
  title?: string;
  type?: 'success' | 'warning' | 'info' | 'error';
  closable?: boolean;
  closeText?: string;
  showIcon?: boolean;
  center?: boolean;
  effect?: 'light' | 'dark';
  children?: JSX.Element;
  onClose?: (e: MouseEvent) => void;
}
