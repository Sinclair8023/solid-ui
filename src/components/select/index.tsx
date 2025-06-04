import { Component, JSX, mergeProps} from 'solid-js';
import { useNamespace } from '@/effect-hooks/use-namespace';
import { classNames } from '@/utils/dom/style';

export interface SelectProps extends JSX.HTMLAttributes<SelectInstance> {

}

export interface SelectInstance {

}

const defaultProps: Partial<SelectProps> = {};

const Select: Component<SelectProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('select');

  return <div class={classNames(ns.b())}></div>
}

export default Select;

