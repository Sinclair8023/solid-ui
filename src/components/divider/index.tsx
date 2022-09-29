import { Component, JSX, mergeProps, splitProps} from 'solid-js';
import { useNamespace } from '/@/effect-hooks/use-namespace';
import { classNames, mergeStyle } from '/@/utils/dom/style';

export interface DividerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  direction: 'horizontal' | 'vertical';
  contentPosition: 'left' | 'center' | 'right';
  borderStyle: JSX.CSSProperties['border-style'];
}

const defaultProps: Partial<DividerProps> = {
  direction: 'horizontal',
  contentPosition: 'center',
  borderStyle: 'solid'
};

const Divider: Component<DividerProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('divider');
  const [localPorps, divProps] = splitProps(props, ['class', 'style', 'contentPosition', 'direction', 'borderStyle', 'children'])
  const style= () => (mergeStyle(localPorps.style, ns.cssVar({
    'border-style': localPorps.borderStyle
  })))
  return <div class={classNames(ns.b(), localPorps.class)} style={style()} role="separator" {...divProps}>
    {
      localPorps.children && localPorps.direction !== 'vertical' && <div class={classNames(ns.e('text'), ns.is(localPorps.contentPosition))}>{localPorps.children}</div>
    }
  </div>
}

export default Divider;

