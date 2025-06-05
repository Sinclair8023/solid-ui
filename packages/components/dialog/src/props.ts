import { Accessor, JSX } from "solid-js";

export interface DialogProps extends JSX.HTMLAttributes<DialogInstance> {
  // 是否让 Dialog 的 header 和 footer 部分居中排列
  center?: boolean;
  // 是否水平垂直对齐对话框
  alignCenter?: boolean;
  closeIcon?: string;
  draggable?: boolean;
  fullscreen?: boolean;
  showClose?: boolean;
  title?: string;
  header?: JSX.Element;
  footer?: JSX.Element;
  lockScroll?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  escClosable?: boolean;
  zIndex?: number;
  top?: number;
  width?: number;
  openDelay?: number;
  closeDelay?: number;
  visible?: boolean;
  beforeClose?: () => Promise<boolean> | boolean;
  onOpen?: () => void;
  onClose?: () => void;
}
export interface DialogInstance {
  visible: Accessor<boolean>,
  open: () => void;
  close: () => void;
}
