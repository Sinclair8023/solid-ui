import { DialogInstance, DialogProps } from '../../dialog';

export interface DrawerProps extends Omit<DialogProps, 'draggable'> {
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt';
  size?: string | number;
  withHeader?: boolean;
  // resizeable?: boolean;
  // fullscreenable?: boolean;
}

export type DrawerInstance = DialogInstance;
