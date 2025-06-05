import { isArray, isFunction } from "lodash-es";
import { Accessor, JSX } from "solid-js";
import { useClickOutside, UseClickOutsideOptions } from "@solid-ui/hooks/use-click-outside";
type Handler = (event: MouseEvent) => void

declare module "solid-js" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Directives {
      clickOutside: Handler | [Handler, UseClickOutsideOptions];
    }
  }
}


export function clickOutside(element: Element, accessor: Accessor<Handler | [Handler, UseClickOutsideOptions]>) {
  const args = accessor();
  let handler: Handler;
  let options: UseClickOutsideOptions = {};
  if (isFunction(args)) {
    handler = args as Handler;
  }
  if (isArray(args)) {
    handler = args[0];
    options = args[1];
  }
  useClickOutside(element, handler!, options);
}

