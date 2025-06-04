import { isNumber, isString } from 'lodash-es';
import { Component, JSX, mergeProps, Switch, Match, splitProps, createSignal, createEffect, on } from 'solid-js';
import Icon from '../icon';
import { ComponentSize } from '@/constants/size';
import { useNamespace } from '@/effect-hooks/use-namespace';
import { addUnit, classNames, mergeStyle } from '@/utils/dom/style';

export interface AvatarProps extends JSX.HTMLAttributes<AvatarInstance> {
  size?: ComponentSize | number;
  shape?: 'circle' | 'square';
  icon?: string;
  src?: string;
  alt?: string;
  srcSet?: string;
  fit?: JSX.CSSProperties['object-fit'];
  onError?: (evt: Event) => void;
}

export interface AvatarInstance { }

const defaultProps: Partial<AvatarProps> = {
  shape: 'circle',
  fit: 'cover'
};

const Avatar: Component<AvatarProps> = (_props) => {
  const propsAndAttrs = mergeProps(defaultProps, _props);
  const [props, attrs] = splitProps(propsAndAttrs, ['size', 'shape', 'icon', 'src', 'srcSet', 'fit', 'onError', 'class', 'style', 'children', 'ref']);
  const ns = useNamespace('avatar');
  const [hasLoadError, setLoadError] = createSignal(false);
  const sizeStyle = () => {
    const { size } = props
    if (isNumber(size)) {
      return mergeStyle(ns.cssVarBlock({
        size: addUnit(size) || '',
      }), props.style)
    }
    return props.style
  }
  createEffect(on(() => props.src, () => {
    setLoadError(false)
  }, { defer: true }))
  function handleError(e: Event) {
    setLoadError(true);
    props.onError?.(e);
  }
  return <div
    class={classNames(props.class, ns.b(),
      ns.m(props.shape),
      { [ns.m('icon')]: props.icon, [ns.m(`${props.size}`)]: isString(props.size) })}
    style={sizeStyle()}
    {...attrs}
  >
    <Switch fallback={props.children}>
      <Match when={(props.src || props.srcSet) && !hasLoadError()}>
        <img src={props.src} srcset={props.srcSet} style={{ "object-fit": props.fit }} onError={handleError} />
      </Match>
      <Match when={props.icon}>
        <Icon icon={props.icon!} />
      </Match>
    </Switch>
  </div>
}

export default Avatar;

