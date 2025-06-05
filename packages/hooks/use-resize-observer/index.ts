import { Accessor, createEffect, onCleanup } from "solid-js"

export interface ResizeObserverEntry {
  readonly target: Element
  readonly contentRect: DOMRectReadOnly
  readonly borderBoxSize?: ReadonlyArray<ResizeObserverSize>
  readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>
}

export type ResizeObserverCallback = (entries: ReadonlyArray<ResizeObserverEntry>, observer: ResizeObserver) => void

export function useResizeObserver(target: Accessor<HTMLElement | null | undefined>, callback: ResizeObserverCallback, options?: ResizeObserverOptions) {
  let observer: ResizeObserver | undefined;
  const isSupported = window && 'ResizeObserver' in window;
  let isStopped = false;
  createEffect(() => {
    clearup();
    if (isSupported && !isStopped && target()) {
      observer = new ResizeObserver(callback);
      observer.observe(target()!, options);
    }
    onCleanup(clearup);
  })
  function clearup() {
    observer?.disconnect();
    observer = undefined;
  }
  function stop() {
    clearup();
    isStopped = true;
  }
  return {
    isSupported,
    stop
  }
}
