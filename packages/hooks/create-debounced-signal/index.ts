import { debounce } from "lodash-es";
import { createSignal } from "solid-js";
import { Setter, Signal, SignalOptions } from "solid-js/types/reactive/signal";

export function createDebouncedSignal<T>(value:T, options?: SignalOptions<T> & { wait?: number} ): Signal<T> {
  const [getValue, setValue] = createSignal(value, options);
  const set = debounce<Setter<T>>(setValue, options?.wait);
  return [getValue, set as unknown as Setter<T>];
}
