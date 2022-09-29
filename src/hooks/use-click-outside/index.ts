import { castArray } from "lodash-es";
import { MaybeElementAccessor, unAccessor } from "../type";
import { useEventListener } from "../use-event-listener";
import { ConfigurableWindow, defaultWindow } from "../_configurable";


export interface UseClickOutsideOptions extends ConfigurableWindow {
  /**
   * List of elements that should not trigger the event.
   */
  ignore?: MaybeElementAccessor[];
  /**
   * Use capturing phase for internal event listener.
   * @default true
   */
  capture?: boolean;
  cusomEventType?: keyof HTMLElementEventMap | (keyof HTMLElementEventMap)[];
}

export function useClickOutside(target: MaybeElementAccessor, handler: (event: MouseEvent) => void, options: UseClickOutsideOptions = {}) {
  const { window = defaultWindow, ignore = [], capture = true, cusomEventType } = options

  if (!window) return

  const listener = (event: MouseEvent) => {
    const el = unAccessor(target);
    const ignoreList = [el, ...ignore.map(unAccessor)];
    const composedPath = event.composedPath();
    if (!el || ignoreList.some(item => item === event.target || composedPath.includes(item))) {
      return
    }
    handler(event);
  }
  const cleanup: Fn[] = [];
  if (!cusomEventType) {
    cleanup.push(useEventListener(window, 'click', listener, { passive: true, capture }))
  } else {
    castArray(cusomEventType).forEach(item => {
      cleanup.push(useEventListener(window, item, listener, { passive: true, capture }))
    })
  }

  return () => cleanup.forEach(i => i());
}
