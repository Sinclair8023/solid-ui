import { JSX } from "solid-js";
import { ButtonGroupInstance } from "./useButtonContext";

export interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement>, ButtonGroupInstance {
  disabled?: boolean;
  icon?: string;
  nativeType?: 'button' | 'reset' | 'submit';
  loading?: boolean;
  loadingIcon?: string;
  plain?: boolean;
  text?: boolean;
  link?: boolean;
  bg?: boolean;
  autofocus?: boolean;
  round?: boolean;
  circle?: boolean;
  color?: string;
  dark?: boolean;
  autoInsertSpace?: boolean;
  onClick?: (evt: MouseEvent) => void;
}
export type ButtonGroupProps = ButtonGroupInstance & JSX.HTMLAttributes<HTMLDivElement>;
