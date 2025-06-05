import { JSX } from "solid-js";

export interface BacktopProps extends JSX.HTMLAttributes<null> {
  // 滚动高度达到此参数值才出现
  visibilityHeight?: number;
  // 触发滚动的对象
  target?: string;
  // 控制其显示位置，距离页面右边距
  right?: number;
  // 控制其显示位置，距离页面底部距离
  bottom?: number;
}
