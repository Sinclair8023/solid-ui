import { Accessor, Component, createEffect, createSignal, JSX, mergeProps, Show } from 'solid-js';
import { isServer, Portal } from 'solid-js/web';
import { Transition } from 'solid-transition-group';
import { useLocale } from '@/effect-hooks/use-locale';
import { useNamespace } from '@/effect-hooks/use-namespace';
import { useZIndex } from '@/effect-hooks/use-z-index';
import { Position } from '@/hooks/type';
import { useDraggable } from '@/hooks/use-draggable';
import { useEscapeKeydown } from '@/hooks/use-escape-keydown';
import { useLockscreen } from '@/hooks/use-lockscreen';
import { addUnit, classNames } from '@/utils/dom/style';
import { nextTick } from '@/utils/function';
import Icon from '../icon';
import Overlay from '../overlay';

export interface DialogProps extends JSX.HTMLAttributes<DialogInstance> {
  // 是否让 Dialog 的 header 和 footer 部分居中排列
  center?: boolean;
  // 是否水平垂直对齐对话框
  alignCenter?: boolean;
  closeIcon?: string;
  draggable?: boolean;
  fullscreen?: boolean;
  showClose?: boolean;
  title?: string;
  header?: JSX.Element;
  footer?: JSX.Element;
  lockScroll?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  escClosable?: boolean;
  zIndex?: number;
  top?: number;
  width?: number;
  openDelay?: number;
  closeDelay?: number;
  visible?: boolean;
  beforeClose?: () => Promise<boolean> | boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface DialogInstance {
  visible: Accessor<boolean>,
  open: () => void;
  close: () => void;
}

const defaultProps: Partial<DialogProps> = {
  closeIcon: 'ep:close',
  mask: true,
  visible: true,
  maskClosable: true,
  escClosable: true,
  showClose: true,
  lockScroll: true,
};

const Dialog: Component<DialogProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('dialog');
  const { t } = useLocale();
  const [zIndex, setZIndex] = createSignal(props.zIndex || useZIndex());
  const [visible, setVisible] = createSignal(!!props.visible);
  let headerRef: HTMLHeadElement;
  let dialogRef: HTMLDivElement;
  let transform: Position;

  const overlayDialogStyle = () => props.alignCenter ? { display: 'flex' } : {};
  const style = () => {
    const style: JSX.CSSProperties = {};
    const varPrefix = `--${ns.namespace}-dialog` as const
    if (!props.fullscreen) {
      if (props.top) {
        style[`${varPrefix}-margin-top`] = props.top
      }
      if (props.width) {
        style[`${varPrefix}-width`] = addUnit(props.width)
      }
    }
    if (transform) {
      style.transform = `translate(${addUnit(transform.x)}, ${addUnit(transform.y)})`
    }
    return style
  }
  if (props.lockScroll) {
    useLockscreen(visible);
  }
  {
    (props.ref as (el: DialogInstance) => void)?.({
      open: doOpen,
      close: doClose,
      visible
    })
  }
  createEffect(() => {
    props.visible ? doOpen() : doClose();
  })
  createEffect((prev?: Fn) => {
    prev?.();
    if (visible() && props.draggable) {
      return useDraggable(() => headerRef, {
        initialValue: transform,
        targetAccessor: () => dialogRef,
        onEnd: (pos) => transform = pos
       })
    }
  })

  function doOpen() {
    if (isServer) return
    setZIndex(props.zIndex || useZIndex());
    setVisible(true);
    nextTick(() => props.onOpen?.())
  }
  function doClose() {
    setVisible(false);
    nextTick(() => props.onClose?.());
  }
  async function handleClose() {
    const shouldClose = (await props.beforeClose?.()) ?? true;
    if (shouldClose) {
      doClose();
    }
  }
  function handleMaskClick() {
    if (props.maskClosable && props.mask) {
      handleClose()
    }
  }
  if (props.escClosable) {
    useEscapeKeydown(handleClose)
  }

  return <Portal mount={document.body}>
    <Transition name="dialog-fade" appear>
      <Show when={visible()}>
        <Overlay
          mask={props.mask}
          zIndex={zIndex()}
          onClick={handleMaskClick}
        >
          <div
            role="dialog"
            aria-model="true"
            class={ns.namespace + '-overlay-dialog'} style={overlayDialogStyle()}>
            <div
              ref={ref => dialogRef = ref}
              class={classNames(ns.b(),
                ns.is('fullscreen', props.fullscreen),
                ns.is('draggable', props.draggable),
                ns.is('align-center', props.alignCenter),
                { [ns.m('center')]: props.center })}
              style={style()}
              onClick={e => e.stopPropagation()}
            >
              <header class={ns.e('header')} ref={ref => headerRef = ref}>
                <Show when={props.header} fallback={<span role="heading" class={ns.e('title')}> {props.title}</span>}>
                  {props.header}
                </Show>
                <Show when={props.closeIcon && props.showClose}>
                  <button aria-label={t('el.dialog.close')} class={ns.e('headerbtn')} type="button" onClick={handleClose}>
                    <Icon class={ns.e('close')} icon={props.closeIcon!} />
                  </button>
                </Show>
              </header>
              <div class={ns.e('body')}>
                {props.children}
              </div>
              <Show when={props.footer}>
                <footer class={ns.e('footer')}>
                  {props.footer}
                </footer>
              </Show>
            </div>
          </div>
        </Overlay>
      </Show>
    </Transition>
  </Portal>
}

export default Dialog;

