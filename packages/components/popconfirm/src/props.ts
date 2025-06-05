import { ButtonProps } from '../../button';
import { PopperProps } from '../../popper';

export interface PopconfirmProps extends Omit<PopperProps, 'content'> {
  title?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonType?: ButtonProps['type'] | 'text';
  cancelButtonType?: ButtonProps['type'] | 'text';
  icon?: string;
  iconColor?: string;
  onConfirm?: (e: Event) => Promise<void> | void;
  onCancel?: (e: Event) => Promise<void> | void;
  width?: number;
}
