import { createSignal } from "solid-js"

export function useRef<T>(val?: T): { value?: T } {
  const [getter, setter] = createSignal(val);
  return new Proxy({ value: val }, {
    get(target, prop) {
      if (prop === 'value') {
        return getter()
      }
      return undefined
    },
    set(target, prop, value) {
      if (prop === 'value') {
        setter(value)
      }
      return true
    }
  })
}
