import { Accessor, createRenderEffect } from "solid-js";

declare module "solid-js" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Directives {
      show?: () => boolean
    }
  }
}

export default function show(el: HTMLElement, accessor: Accessor<boolean>) {
  const display = getComputedStyle(el).display;
  createRenderEffect(() => {
    el.style.display = accessor() ? display : 'none'
  })
}

