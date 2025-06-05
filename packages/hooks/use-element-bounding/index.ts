import { Accessor, createSignal } from "solid-js"
import { useEventListener } from "../use-event-listener"
import { useResizeObserver } from "../use-resize-observer"

export interface UseElementBoundingOptions {
  /**
   * Reset values to 0 on component unmounted
   *
   * @default true
   */
  reset?: boolean

  /**
   * Listen to window resize event
   *
   * @default true
   */
  windowResize?: boolean
  /**
   * Listen to window scroll event
   *
   * @default true
   */
  windowScroll?: boolean

  /**
   * Immediately call update on component mounted
   *
   * @default true
   */
  immediate?: boolean
}

export interface ElementBounding {
  height: number;
  width: number;
  x: number;
  y: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const defaultBounding = { height: 0, width: 0, x: 0, y: 0, left: 0, right: 0, top: 0, bottom: 0 }
export function useElementBounding(target: Accessor<HTMLElement | null | undefined>, options: UseElementBoundingOptions = {}) {
  const {
    reset = true,
    windowResize = true,
    windowScroll = true,
  } = options;
  const [bounding, setBounding] = createSignal<ElementBounding>({ ...defaultBounding });
  useResizeObserver(target, update);

  if (windowScroll) {
    useEventListener('scroll', update, { passive: true })
  }
  if (windowResize) {
    useEventListener('resize', update, { passive: true })
  }


  function update() {
    const el = target();
    if (!el) {
      if (reset) {
        setBounding(() => ({ ...defaultBounding }))
      }
      return;
    }
    const rect = el.getBoundingClientRect();
    setBounding(() => ({
      height: rect.height, width: rect.width, x: rect.x, y: rect.y, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom
     }))
  }
  // onMount(update)
  return bounding
}
