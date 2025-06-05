import { Placement, Strategy } from '@floating-ui/dom';
import { Accessor, JSX } from 'solid-js';

export interface PopperProps {
  ref?: PopperInstance | ((ref: PopperInstance) => void);
  mountTo?: string | HTMLElement;
  class?: string;
  style?: JSX.CSSProperties;
  effect?: 'light' | 'dark';
  content?: JSX.Element;
  title?: JSX.Element;
  placement?: Placement;
  autoPlacement?: Placement[] | boolean;
  strategy?: Strategy;
  disabled?: boolean;
  // 出现位置的偏移量
  offset?: number;
  arrow?: boolean;
  visible?: boolean;
  hideAfter?: number;
  transition?: string;
  trigger?: 'hover' | 'click' | 'contextmenu';
  children?: JSX.Element;
  onShow?: () => void;
  onHide?: () => void;
}

export interface PopperInstance {
  show: () => void;
  hide: () => void;
  toggle?: () => void;
  visible: Accessor<boolean>;
  setTrigger?: (el: HTMLElement) => void;
}
