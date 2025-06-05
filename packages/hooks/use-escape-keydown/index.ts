import { onCleanup, onMount } from "solid-js"
import { isServer } from "solid-js/web"
import { EVENT_CODE } from "@solid-ui/constants/aria"


let registeredEscapeHandlers: ((e: KeyboardEvent) => void)[] = []

const cachedHandler = (e: Event) => {
  const event = e as KeyboardEvent
  if (event.key === EVENT_CODE.esc) {
    registeredEscapeHandlers.forEach((registeredHandler) =>
      registeredHandler(event)
    )
  }
}

export const useEscapeKeydown = (handler: (e: KeyboardEvent) => void) => {
  onMount(() => {
    if (registeredEscapeHandlers.length === 0) {
      document.addEventListener('keydown', cachedHandler)
    }
    if (!isServer) registeredEscapeHandlers.push(handler)
  })

  onCleanup(() => {
    registeredEscapeHandlers = registeredEscapeHandlers.filter(
      (registeredHandler) => registeredHandler !== handler
    )
    if (registeredEscapeHandlers.length === 0) {
      if (!isServer) document.removeEventListener('keydown', cachedHandler)
    }
  })
}
