import { Component, JSX, mergeProps, splitProps} from 'solid-js';
import { useNamespace } from '/@/effect-hooks/use-namespace';
import { classNames, mergeStyle } from '/@/utils/dom/style';

export interface OverlayProps extends JSX.HTMLAttributes<HTMLDivElement> {
  mask?: boolean;
  class?: string;
  zIndex: number;
}

const defaultProps: Partial<OverlayProps> = {
  mask: true,
};

const Overlay: Component<OverlayProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('overlay');
  const [localProps, divProps] = splitProps(props, ['class', 'style', 'zIndex', 'mask'])
  const style = (): JSX.CSSProperties => {
    const style = props.mask ? {
      'z-index': localProps.zIndex
    } : {
      'z-index': localProps.zIndex,
      position: 'fixed',
      top: '0px',
      right:'0px',
      bottom: '0px',
      left:'0px',
    }
    return mergeStyle(props.style, style)
  }
  return <div class={classNames(localProps.class, localProps.mask ? ns.b() : '')} style={style()} {...divProps} />
}

export default Overlay;

