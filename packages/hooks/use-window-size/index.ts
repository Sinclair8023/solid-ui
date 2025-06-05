import { createSignal } from "solid-js";
import { useEventListener } from "../use-event-listener";
import { ConfigurableWindow, defaultWindow } from "../_configurable";

export interface WindowSizeOptions extends ConfigurableWindow {
  initialWidth?: number
  initialHeight?: number
}
export function useWindowSize({ window = defaultWindow,  initialWidth = Infinity, initialHeight = Infinity }: WindowSizeOptions = {}) {
  const [size, setSize] = createSignal({ width: initialWidth, height: initialHeight })
  useEventListener('resize', update);

  function update() {
    if (window) {
      setSize(() => ({ width: window.innerWidth, height: window.innerHeight}))
    }
  }
  return size
}
