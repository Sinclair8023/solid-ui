import { Component, mergeProps, splitProps } from 'solid-js';
import { Popper } from '../../popper';
import { useNamespace } from '@solid-ui/hooks';
import { classNames } from '@solid-ui/utils';
import { PopoverProps } from './props';

const defaultProps: Partial<PopoverProps> = {
  trigger: 'click'
};

const Popover: Component<PopoverProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const [localPorps, popperProps] = splitProps(props, ['content', 'title', 'class'])
  const ns = useNamespace('popover');

  return <Popper {...popperProps}
    class={classNames(ns.b(), props.class)}
    content={[localPorps.title && <div class={ns.e('title')}>{localPorps.title}</div>, localPorps.content]}
  />
}

export default Popover;

