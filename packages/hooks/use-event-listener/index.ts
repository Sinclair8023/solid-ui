import { isFunction, isString, noop } from "lodash-es";
import { Accessor, createEffect, onCleanup } from "solid-js";
import { MaybeAccessor } from "../type";
import { defaultWindow } from '../_configurable'


interface InferEventTarget<Events> {
  addEventListener(event: Events, fn?: any, options?: any): any
  removeEventListener(event: Events, fn?: any, options?: any): any
}

export type WindowEventName = keyof WindowEventMap
export type DocumentEventName = keyof DocumentEventMap

export interface GeneralEventListener<E = Event> {
  (evt: E): void
}

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 1: Omitted Window target
 *
 * @see https://vueuse.org/useEventListener
 * @param event
 * @param listener
 * @param options
 */
 export function useEventListener<E extends keyof WindowEventMap>(event: E, listener: (this: Window, ev: WindowEventMap[E]) => any, options?: boolean | AddEventListenerOptions): Fn

 /**
  * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
  *
  * Overload 2: Explicitly Window target
  *
  * @see https://vueuse.org/useEventListener
  * @param target
  * @param event
  * @param listener
  * @param options
  */
 export function useEventListener<E extends keyof WindowEventMap>(target: Window, event: E, listener: (this: Window, ev: WindowEventMap[E]) => any, options?: boolean | AddEventListenerOptions): Fn

 /**
  * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
  *
  * Overload 3: Explicitly Document target
  *
  * @see https://vueuse.org/useEventListener
  * @param target
  * @param event
  * @param listener
  * @param options
  */
 export function useEventListener<E extends keyof DocumentEventMap>(target: Document, event: E, listener: (this: Document, ev: DocumentEventMap[E]) => any, options?: boolean | AddEventListenerOptions): Fn

 /**
  * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
  *
  * Overload 4: Custom event target with event type infer
  *
  * @see https://vueuse.org/useEventListener
  * @param target
  * @param event
  * @param listener
  * @param options
  */
 export function useEventListener<Names extends string, EventType = Event>(target: InferEventTarget<Names>, event: Names, listener: GeneralEventListener<EventType>, options?: boolean | AddEventListenerOptions): Fn

 /**
  * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
  *
  * Overload 5: Custom event target fallback
  *
  * @see https://vueuse.org/useEventListener
  * @param target
  * @param event
  * @param listener
  * @param options
  */
 export function useEventListener<EventType = Event>(target: MaybeAccessor<EventTarget | null | undefined>, event: string, listener: GeneralEventListener<EventType>, options?: boolean | AddEventListenerOptions): Fn


export function useEventListener(...args: any[]) {
  let target: Accessor<EventTarget> | EventTarget | undefined;
  let event: string;
  let listener: any;
  let options: any;
    let isStopped = false;
  if (isString(args[0])) {
    [event, listener, options] = args
    target = defaultWindow
  } else {
    [target, event, listener, options] = args
  }
  if (!target) {
    return noop
  }
  createEffect(() => {
    const el = isFunction(target) ? target() : target;
    if (!el || isStopped) {
      return
    }
    el.addEventListener(event, listener, options);
  })
  function clearup() {

    const el = isFunction(target) ? target() : target;
    el?.removeEventListener(event, listener, options);
  }
  const stop = () => {
    clearup();
    isStopped = true;
  }
  onCleanup(() => {
    console.log('onCleanup')
    clearup()
  })
  return stop;
}
