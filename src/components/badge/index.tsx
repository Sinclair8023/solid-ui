import { isNumber } from "lodash-es";
import { Component, JSX, mergeProps, Show, splitProps } from "solid-js"
import { Transition } from "solid-transition-group";
import { useNamespace } from "/@/effect-hooks/use-namespace";
import { classNames } from "/@/utils/dom/style";

export interface BadgeProps extends JSX.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  max?: number;
  isDot?: boolean;
  hidden?: boolean;
  type?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
}

const defaultProps: Partial<BadgeProps> = {
  value: '',
  max: 99,
  type: 'danger'
}

const Badge: Component<BadgeProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('badge');
  const [localProps, attrs] = splitProps(props, ['value', 'max', 'isDot', 'hidden', 'type', 'class', 'children'])
  const content = () => {
    if (localProps.isDot) return ''

    if (isNumber(props.value) && isNumber(localProps.max)) {
      return localProps.max! < localProps.value ? `${localProps.max}+` : `${localProps.value}`
    }
    return `${localProps.value}`
  }
  return <div class={classNames(ns.b(), props.class)} {...attrs} >
    {props.children}
    <Transition name={`${ns.namespace}-zoom-in-center`} appear>
      <Show when={!props.hidden && (content() || props.isDot)}>
        <sup class={classNames(ns.e('content'), ns.em('content', localProps.type), ns.is('fixed', !!localProps.children), ns.is('dot', localProps.isDot))}>{content()}</sup>
      </Show>
    </Transition>
  </div>
}
export default Badge
