import { debounce, isString } from 'lodash-es';
import { Accessor, children, Component, createEffect, createSignal, JSX, mergeProps, on, onCleanup } from 'solid-js';
import { useNamespace } from '@/effect-hooks/use-namespace';
import { classNames } from '@/utils/dom/style';
import { arrow, autoPlacement, computePosition, flip, Middleware, offset, Placement, shift, Strategy } from '@floating-ui/dom'
import { useClickOutside } from '@/hooks/use-click-outside';
import { Transition } from 'solid-transition-group';
import { nextTick } from '@/utils/function';
import { Portal } from 'solid-js/web';

export interface PopperProps {
  ref?: PopperInstance | ((ref: PopperInstance) => void);
  mountTo?: string | HTMLElement;
  class?: string;
  style?: JSX.CSSProperties;
  effect?: 'light' | 'dark';
  content?: JSX.Element;
  title?: JSX.Element;
  placement?: Placement;
  autoPlacement?: Placement[] | boolean;
  strategy?: Strategy
  disabled?: boolean;
  // 出现位置的偏移量
  offset?: number;
  arrow?: boolean;
  visible?: boolean;
  hideAfter?: number;
  transition?: string;
  trigger?: 'hover' | 'click' | 'contextmenu';
  children?: JSX.Element;
  onShow?: () => void;
  onHide?: () => void;
}

export interface PopperInstance {
  show: () => void;
  hide: () => void;
  toggle?: () => void;
  visible: Accessor<boolean>;
  setTrigger?: (el: HTMLElement) => void;
}
const ns = useNamespace('popper');
const defaultProps: Partial<PopperProps> = {
  strategy: 'absolute',
  trigger: 'hover',
  placement: 'bottom',
  hideAfter: 200,
  offset: 6,
  arrow: true,
  effect: 'light',
  transition: `${ns.namespace}-fade-in-linear`,
  mountTo: document.body,
};

const showEventMap: Record<'hover' | 'click' | 'contextmenu', keyof HTMLElementEventMap> = {
  hover: 'mouseenter',
  click: 'click',
  contextmenu: 'contextmenu'
}
const hideEventMap: Record<'hover' | 'click' | 'contextmenu', Arrayable<keyof HTMLElementEventMap>> = {
  hover: ['mouseenter', 'click', 'focus'],
  click: ['click', 'focus'],
  contextmenu: ['click', 'focus'],
}
const Popper: Component<PopperProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);

  const [visible, setVisible] = createSignal(false);
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();

  let contentRef: HTMLElement | null = null;
  let arrowRef: HTMLElement | null = null;
  let cleanup: Fn | undefined;

  const mount = () => isString(props.mountTo) ? document.body.querySelector(props.mountTo) : props.mountTo;

  createEffect(on(() => props.visible, (val) => {
    setVisible(!!val);
  }))
  createEffect(on(visible, (val) => {
    if (val && triggerRef() && contentRef) {
      const middleware: Middleware[] = [shift()];
      if (props.arrow) {
        middleware.push(arrow({ element: arrowRef! }))
      }
      if (props.offset) {
        middleware.push(offset(props.offset))
      }
      if (props.autoPlacement) {
        middleware.push(autoPlacement({
          allowedPlacements: props.autoPlacement === true ? undefined : props.autoPlacement
        }))
      }

      computePosition(
        triggerRef()!,
        contentRef!,
        {
          placement: props.placement, middleware,
          strategy: props.strategy
        }).then(({ x, y, middlewareData, placement }) => {
          Object.assign(contentRef!.style, {
            position: props.strategy,
            left: `${x}px`,
            top: `${y}px`
          })

          if (props.arrow) {
            const { x: arrowX, y: arrowY } = middlewareData.arrow;
            const staticSide = {
              top: 'bottom',
              right: 'left',
              bottom: 'top',
              left: 'right',
            }[placement!.split('-')[0]] as string;

            Object.assign(arrowRef!.style, {
              left: arrowX != null ? `${arrowX}px` : '',
              top: arrowY != null ? `${arrowY}px` : '',
              right: '',
              bottom: '',
              [staticSide]: '-4px',
            })
            contentRef!.dataset.popperPlacement = placement
          }

        })
      cleanup?.();
      cleanup = useClickOutside(contentRef!, debounce(hide, props.hideAfter), { ignore: [triggerRef], cusomEventType: hideEventMap[props.trigger!] });

    } else {
      // setContentStyle({ ...props.style, visibility: 'hidden' })
    }
  }, { defer: !props.visible }))

  const instance: PopperInstance = {
    show,
    hide,
    toggle,
    visible,
    setTrigger: setTriggerRef,
  }
  const ref = props.ref as (ref: PopperInstance) => void
  ref?.(instance);
  function show() {
    if (!props.disabled) {
      setVisible(true);
      props.onShow?.();
    }
  }
  function hide() {
    setVisible(false);
    props.onHide?.();
  }
  function toggle() {
    visible() ? hide() : show();
  }
  const resolvedChildren = children(() => props.children!);
  const childrenNode = resolvedChildren() as HTMLElement;
  childrenNode.addEventListener(showEventMap[props.trigger!], handleShow)
  setTriggerRef(childrenNode)
  function handleShow(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    show();
  }
  onCleanup(() => cleanup?.())
  return <>
    {resolvedChildren()}
    {
      !props.disabled && visible() && <Portal mount={mount()!}>
        <Transition name={props.transition}>
        <div ref={ref => contentRef = ref} class={classNames(ns.b(), props.class, 'is-' + props.effect)} style={props.style}>
          {props.content}
          {props.arrow && <div ref={ref => arrowRef = ref} class={classNames(ns.e('arrow'))}></div>}
        </div>
      </Transition>
      </Portal>
    }
  </>
}

export default Popper;

