import { ComponentSize } from '@solid-ui/constants';
import { JSX } from 'solid-js';

export interface InputNUmberInstance {
  focus: () => void;
  blur: () => void;
}

export interface InputNumberProps {
  ref?: InputNUmberInstance | ((ref: InputNUmberInstance) => void);
  class?: string;
  style?: JSX.CSSProperties;
  step?: number;
  stepStrictly?: boolean;
  max?: number;
  min?: number;
  value?: number;
  disabled?: boolean;
  size?: ComponentSize;
  controls?: boolean;
  controlsPosition?: '' | 'right';
  valueOnClear?: 'min' | 'max' | number;
  label?: string;
  placeholder?: string;
  precision?: number;
  validateEvent?: boolean;
  onChange?: (value?: number) => void;
  onInput?: (value?: number) => void;
  onFocus?: (e: MouseEvent | FocusEvent) => void;
  onBlur?: (e: MouseEvent | FocusEvent) => void;
}
