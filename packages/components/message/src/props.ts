import { JSX } from 'solid-js';

export interface MessageProps extends JSX.HTMLAttributes<MessageInstance> {
  message?: JSX.Element;
  type: 'success' | 'info' | 'warning' | 'error';
  icon?: string;
  duration?: number;
  showClose?: boolean;
  center?: boolean;
  offset?: number;
  onClose?: () => void;
}

export interface MessageInstance {}
