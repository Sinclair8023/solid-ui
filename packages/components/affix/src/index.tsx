import { Component, createEffect, createSignal, mergeProps, onMount, batch } from "solid-js";
import { useElementBounding, useEventListener, useNamespace, useWindowSize } from "@solid-ui/hooks";
import { throwError, classNames, getScrollContainer } from "@solid-ui/utils";
import { AffixProps } from "./props";

const defaultProps: AffixProps = {
  zIndex: 100,
  offset: 0,
  position: 'top'
}

const Affix: Component<AffixProps> = (_props) => {
  const props = mergeProps<AffixProps[]>(defaultProps, _props);
  const ns = useNamespace('affix');
  const [target, setTarget] = createSignal<HTMLElement | null>(null);
  const [root, setRoot] = createSignal<HTMLDivElement | null>(null);
  const [scrollContainer, setScrollContainer] = createSignal<HTMLElement | Window>();

  const [fixed, setFixed] = createSignal(false);
  const [scrollTop, setScrollTop] = createSignal(0);
  const [transform, setTransform] = createSignal(0);

  const windowSize = useWindowSize();
  const rootRect = useElementBounding(root);
  const targetRect = useElementBounding(target);

  const rootStyle = () => {
    if (!fixed() || (rootRect().width === 0 && rootRect().height === 0)) {
      return {}
    }
    return {
      height: `${rootRect().height}px`,
      width: `${rootRect().width}px`,
    }
  }
  const affixStyle = () => {
    if (!fixed() || rootRect().width === 0 && rootRect().height === 0) {
      return {}
    }
    const offset = props.offset ? `${props.offset}px` : '0';
    return {
      height: `${rootRect().height}px`,
      width: `${rootRect().width}px`,
      top: props.position === 'top' ? offset : '',
      bottom: props.position === 'bottom' ? offset : '',
      transform: transform() ? `translateY(${transform()}px)` : '',
    }
  }

  onMount(() => {
    batch(() => {
      if (props.target) {
        setTarget(() => {
          const el = document.body.querySelector<HTMLElement>(props.target!);
          if (!el) {
            throwError('Affix', `Target is not existed: ${props.target}`);
          }
          return el
        })
      } else {
        setTarget(() => document.documentElement)
      }
      setScrollContainer(() => getScrollContainer(root()!, true))
    })
  })
  createEffect(update);
  function update() {
    if (!scrollContainer()) {
      return
    }
    const offset = props.offset || 0;
    const container = scrollContainer()
    setScrollTop(() => container instanceof Window
      ? document.documentElement.scrollTop
      : container?.scrollTop || 0)
    if (props.position === 'top') {
      if (props.target) {
        const difference = targetRect().bottom - offset - rootRect().height;
        setTransform(difference < 0 ? difference : 0)
      } else {
        console.log('setFixed', rootRect(), props.offset)
        setFixed( offset > rootRect().top)
      }
    } else if (props.target) {
      const difference = windowSize().height - targetRect().top - offset - rootRect().height;
      setFixed(windowSize().height - offset < rootRect().bottom && windowSize().height > targetRect().top)
      setTransform( difference < 0 ? -difference : 0)
    } else {
      setFixed(windowSize().height - offset < rootRect().bottom)
    }
  }

  useEventListener(scrollContainer, 'scroll', handleScroll);

  function handleScroll() {
    props.onScroll?.({ scrollTop: scrollTop(), fixed: fixed() })
  }

  return <div ref={ref => setRoot(ref)} class={classNames(ns.b())} style={rootStyle()}>
    <div class={classNames({ [ns.m('fixed')]: fixed() })} style={affixStyle()}>
      {props.children}
    </div>
  </div>
}

export default Affix
