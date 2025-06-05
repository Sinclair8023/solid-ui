import { ComponentSize } from '@solid-ui/constants';
import { Accessor, JSX } from 'solid-js';

type SwitchValue = boolean | string | number;
export interface SwitchProps
  extends Omit<JSX.HTMLAttributes<SwitchInstance>, 'onChange'> {
  value?: SwitchValue;
  disabled?: boolean;
  loading?: boolean;
  width?: string | number;
  inlinePrompt?: boolean;
  activeIcon?: string;
  inactiveIcon?: string;
  activeText?: string;
  activeValue?: SwitchValue;
  inactiveText?: string;
  inactiveValue?: SwitchValue;
  activeColor?: string;
  inactiveColor?: string;
  borderColor?: string;
  size?: ComponentSize;
  validateEvent?: boolean;
  beforeChange?: () => Promise<boolean> | boolean;
  onChange?: (val: SwitchValue) => void;
}

export interface SwitchInstance {
  focus: () => void;
  checked: Accessor<boolean>;
}
