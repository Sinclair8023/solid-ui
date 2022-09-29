import { Component, JSX, mergeProps, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import Icon from '../icon';
import { ComponentSize } from '/@/constants/size';
import { useSize } from '/@/effect-hooks/use-comon-props';
import { useNamespace } from '/@/effect-hooks/use-namespace';
import { classNames, mergeStyle } from '/@/utils/dom/style';

export interface TagProps extends JSX.HTMLAttributes<unknown> {
  closable?: boolean;
  type?: 'success' | 'info' | 'warning' | 'danger' | '';
  hit?: boolean;
  disableTransitions?: boolean;
  color?: string;
  size?: ComponentSize;
  effect?: 'dark' | 'light' | 'plain';
  round?: boolean;
  onClose?: (e: MouseEvent) => void;
  onClick?: (e: MouseEvent) => void;
}

const defaultProps: Partial<TagProps> = {
  effect: 'light'
};

const Tag: Component<TagProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('tag');
  const size = useSize(props);

  const style = () => {
    return mergeStyle(props.style, { "background-color": props.color })
  }

  function handleClose(e: MouseEvent){
    e.stopPropagation();
    props.onClose?.(e);
  }
  function renderContent() {
    return <span
    class={classNames(
      props.class,
      ns.b(),
      ns.is('closable', props.closable),
      ns.m(props.type),
      ns.m(size()),
      ns.m(props.effect),
      ns.is('round', props.round))}
    style={style()}
    onClick={props.onClick}
  >
    <span class={ns.e('content')}>
      {props.children}
    </span>
    {props.closable && <Icon icon="ep:close" class={ns.e('close')} onClick={handleClose} />}
  </span>
  }
  return <Show when={!props.disableTransitions} fallback={renderContent()}>
    <Transition name={`${ns.namespace}-zoom-in-center`} appear>
      {renderContent()}
    </Transition>
  </Show>
}

export default Tag;

