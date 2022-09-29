import { throttle } from 'lodash-es';
import { createSignal, mergeProps, onMount, Show } from 'solid-js';
import type { Component, JSX } from 'solid-js'
import { useNamespace } from '/@/effect-hooks/use-namespace';
import { useEventListener } from '/@/hooks/use-event-listener';
import { addUnit, classNames } from '/@/utils/dom/style';
import { throwError } from '/@/utils/error';
import Icon from '../icon';
import { Transition } from 'solid-transition-group';

export interface BacktopProps extends JSX.HTMLAttributes<null> {
  // 滚动高度达到此参数值才出现
  visibilityHeight?: number;
  // 触发滚动的对象
  target?: string;
  // 控制其显示位置，距离页面右边距
  right?: number;
  // 控制其显示位置，距离页面底部距离
  bottom?: number;
}


const defaultProps: Partial<BacktopProps> = {
  visibilityHeight: 200,
  right: 40,
  bottom: 40
};

const Backtop: Component<BacktopProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('backtop');
  const [visible, setVisible] = createSignal(false);
  const container = document;
  let el: HTMLElement | null = document.documentElement;

  const backTopStyle = () => ({
    right: addUnit(props.right),
    bottom: addUnit(props.bottom)
  })

  onMount(() => {
    if (props.target) {
      el = document.querySelector(props.target);
      if (!el) {
        throwError('Bactop', `target is not existed: ${props.target}`)
      }
    }
    const handleScrollThrottled = throttle(handleScroll, 300);
    useEventListener(container, 'scroll', handleScrollThrottled);
  })
  function handleScroll() {
    if (el) {
      setVisible(el.scrollTop >= props.visibilityHeight!);
    }
  }
  function scrollToTop() {
    el?.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  function handleClick(e: MouseEvent) {
    scrollToTop();
    e.stopPropagation();
  }
  return <Transition name={ns.namespace + '-fade-in'}>
    {
      visible() && <div class={classNames(ns.b())} onClick={handleClick} style={backTopStyle()}>
      <Show when={props.children} fallback={<Icon icon="ep:caret-top" class={ns.e('icon')} />}>
        {props.children}
      </Show>
    </div>
    }
    </Transition>
}

export default Backtop;

