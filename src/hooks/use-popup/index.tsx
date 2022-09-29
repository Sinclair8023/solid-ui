import { Component } from "solid-js";
import { MountableElement, render } from "solid-js/web";

export function usePopup<T extends { onClose?: Fn }>(code: Component<T>, props?: T, to: MountableElement = document.body) {
  const div = document.createElement('div');
  to.appendChild(div);
  const destory = () => {
    dispose?.();
    to.removeChild(div);
  };
  props ||= {} as T;
  props!.onClose = destory;
  const dispose = render(() => <div>{code(props as T)}</div>, div);
  return destory;
}
