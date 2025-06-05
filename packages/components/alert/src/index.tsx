import { Component, createSignal, mergeProps, Show, JSX } from "solid-js";
import { TypeIconMap } from "@solid-ui/constants";
import { useNamespace } from "@solid-ui/hooks";
import { classNames } from "@solid-ui/utils";
import { Icon } from "../../icon";
import { Transition } from "solid-transition-group";
import { AlertProps } from "./props";

const defaultProps: Partial<AlertProps> = { effect: 'light', title: '', type: 'info', closable: true }

const Alert: Component<AlertProps> = (_props) => {
  const props = mergeProps<AlertProps[]>(defaultProps, _props);
  const [visible, setVisible] = createSignal(true);
  const ns = useNamespace('alert');
  function close(evt: MouseEvent) {
    setVisible(() => false);
    props.onClose?.(evt);
  }
  return (<Transition name={ns.b('fade')}>
    {
      visible() ? <div class={classNames(ns.b(), ns.m(props.type), ns.is('center', props.center), ns.is(props.effect!))} role="alert">
        <Show when={props.showIcon}>
          <Icon icon={TypeIconMap[props.type!]} class={classNames(ns.e('icon'), { [ns.is('big')]: props.children })} />
        </Show>
        <div class={ns.e('content')}>
          <Show when={props.title}>
            <span class={classNames(ns.e('title'), { [ns.is('bold')]: props.children })}>{props.title}</span>
          </Show>
          <Show when={props.children}>
            <p class={ns.e('description')}>{props.children}</p>
          </Show>
          <Show when={props.closable} >
            <Show when={props.closeText} fallback={<Icon class={ns.e('close-btn')} icon="ep:close" onClick={close} />}>
              <div class={classNames(ns.e('close-btn'), ns.is('customed'))} onClick={close}>{props.closeText}</div>
            </Show>
          </Show>
        </div>
      </div> : null
    }
  </Transition>
  )
}
export default Alert
