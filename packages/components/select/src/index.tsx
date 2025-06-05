import { Component, JSX, mergeProps } from 'solid-js';
import { useNamespace } from '@solid-ui/hooks';
import { classNames } from '@solid-ui/utils';
import { SelectProps } from './props';


const defaultProps: Partial<SelectProps> = {};

const Select: Component<SelectProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('select');

  return <div class={classNames(ns.b())}></div>
}

export default Select;

