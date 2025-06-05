import { JSX } from 'solid-js';

export interface InputProps
  extends Omit<
    JSX.HTMLAttributes<InputInstance>,
    'prefix' | 'onChange' | 'onInput'
  > {
  class?: string;
  style?: JSX.CSSProperties;
  value?: string;
  step?: number;
  min?: number;
  max?: number;
  name?: string;
  type?: 'text' | 'textarea' | 'number' | 'password';
  size?: 'default' | 'small' | 'large';
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  prepend?: string | JSX.Element;
  append?: string | JSX.Element;
  prefix?: string | JSX.Element;
  suffix?: string | JSX.Element;
  prefixIcon?: string;
  suffixIcon?: string;
  maxLength?: number;
  showWordLimit?: boolean;
  showPassword?: boolean;
  validateEvent?: boolean;
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
}
export interface InputInstance {
  clear: () => void;
  focus: () => void;
  blur: () => void;
  select: () => void;
  input?: TargetElement;
}
export type TargetElement = HTMLInputElement | HTMLTextAreaElement;
