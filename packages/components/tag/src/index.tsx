import { Component, mergeProps, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { Icon } from '../../icon';
import { useSize } from '../../form';
import { useNamespace } from '@solid-ui/hooks';
import { classNames, mergeStyle } from '@solid-ui/utils';
import { TagProps } from './props';

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

  function handleClose(e: MouseEvent) {
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

