import { isString } from "lodash-es";
import { Component, JSX, Show, mergeProps, children, splitProps } from "solid-js";
import { useGlobalConfig, useNamespace } from "@solid-ui/hooks";
import { classNames } from "@solid-ui/utils";
import { Icon } from "../../icon";
import { useButtonContext } from './useButtonContext';
import { ButtonProps } from "./props";
import { useDisabled, useSize } from '../../form'

const defaultProps: Partial<ButtonProps> = { size: 'default', type: 'default', nativeType: 'button', loadingIcon: 'ep:loading' };

const Button: Component<ButtonProps> = (_props: ButtonProps) => {
  const config = useGlobalConfig();

  const propsAndAttrs = mergeProps<ButtonProps[]>(defaultProps, config.button || {}, _props);
  const [props, attrs] = splitProps(propsAndAttrs,
    [
      'class', 'type', 'size', 'icon', 'nativeType', 'loading', 'disabled', 'circle', 'ref',
      'loadingIcon', 'plain', 'text', 'link', 'bg', 'round', 'autofocus', 'color', 'dark', 'autoInsertSpace', 'children'
    ]);
  const ns = useNamespace('button');


  const buttonGroupContext = useButtonContext();
  const size = useSize(buttonGroupContext, () => props.size);
  const disabled = useDisabled(props);
  const type = () => _props.type || buttonGroupContext.type || props.type;

  const buttonText = children(() => props.children);
  const shouldAddSpace = () => {
    const text = buttonText();
    if (props.autoInsertSpace && isString(text)) {
      return /^\p{Unified_Ideograph}{2}$/u.test(text.trim())
    }
    return false;
  }
  return <button ref={props.ref}
    class={classNames(
      props.class,
      ns.b(),
      ns.m(type()),
      ns.m(size()),
      ns.is('disabled', disabled()),
      ns.is('loading', props.loading),
      ns.is('plain', props.plain),
      ns.is('round', props.round),
      ns.is('circle', props.circle),
      ns.is('text', props.text),
      ns.is('link', props.link),
      ns.is('has-bg', props.bg))}
    aria-disabled={disabled() || props.loading}
    disabled={disabled() || props.loading}
    autofocus={props.autofocus}
    type={props.nativeType}
    {...attrs}
  >
    <Show when={props.loading || props.icon}>
      <Icon loading={props.loading} icon={props.loading ? props.loadingIcon! : props.icon!} />
    </Show>
    <Show when={props.children}>
      <span class={classNames({ [ns.em('text', 'expand')]: shouldAddSpace() })}>
        {props.children}
      </span>
    </Show>
  </button>
}
export default Button;
