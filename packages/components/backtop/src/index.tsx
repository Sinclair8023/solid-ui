import { throttle } from 'lodash-es';
import { createSignal, mergeProps, onMount, Show } from 'solid-js';
import type { Component } from 'solid-js'
import { useNamespace } from '@solid-ui/hooks';
import { useEventListener } from '@solid-ui/hooks';
import { addUnit, classNames } from '@solid-ui/utils';
import { throwError } from '@solid-ui/utils';
import { Icon } from '../../icon';
import { Transition } from 'solid-transition-group';
import { BacktopProps } from './props';



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

