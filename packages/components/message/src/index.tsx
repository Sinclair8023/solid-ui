import { Component, createSignal, JSX, mergeProps, onMount, } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { Icon } from '../../icon';
import { TypeIconMap } from '@solid-ui/constants';
import { useNamespace } from '@solid-ui/hooks';
import { useZIndex } from '@solid-ui/hooks';
import { useResizeObserver } from '@solid-ui/hooks/use-resize-observer';
import { addUnit, classNames } from '@solid-ui/utils';
import { MessageProps } from './props';



const defaultProps: Partial<MessageProps> = {
  duration: 3000,
  type: 'info',
  offset: 16,
};
const instances = [];

const Message: Component<MessageProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('message');
  let messageRef: HTMLDivElement;
  const [visible, setVisible] = createSignal(true);
  const [height, setHeight] = createSignal(0);
  const badgeType = () => props.type ? (props.type === 'error' ? 'danger' : props.type) : 'info';
  const zIndex = useZIndex();

  const icon = props.icon || TypeIconMap[props.type];
  const style = () => ({ 'z-index': zIndex, top: addUnit(props.offset) });

  onMount(startTimer);

  let timer: NodeJS.Timeout;
  function startTimer() {
    if (props.duration! <= 0) {
      return
    }
    clearTimer();
    timer = setTimeout(close, props.duration);
  }
  function clearTimer() {
    timer && clearTimeout(timer);
  }
  function close(e?: MouseEvent) {
    e?.stopPropagation();
    setVisible(false);
  }
  return <Transition name={ns.b('fade')}>
    {
      visible() && <div ref={ref => messageRef = ref}
        class={classNames(ns.b(), ns.m(props.type), ns.is('center', props.center), ns.is('closable', props.showClose))}
        style={style()}
        onMouseEnter={clearTimer}
        onMouseLeave={startTimer}
      >
        {icon && <Icon icon={icon} class={classNames(ns.e('icon'), ns.bm('icon', props.type))} />}
        <p class={ns.e('content')}>{props.message}</p>
        {props.showClose && <Icon class={ns.e('closeBtn')} icon="ep:close" onClick={close} />}
      </div>
    }
  </Transition>
}

export default Message;

