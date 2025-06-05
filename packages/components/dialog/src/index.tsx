import { Accessor, Component, createEffect, createSignal, JSX, mergeProps, Show } from 'solid-js';
import { isServer, Portal } from 'solid-js/web';
import { Transition } from 'solid-transition-group';
import { useLocale } from '@solid-ui/hooks';
import { useNamespace } from '@solid-ui/hooks';
import { useZIndex } from '@solid-ui/hooks';
import { useDraggable } from '@solid-ui/hooks';
import { useEscapeKeydown } from '@solid-ui/hooks';
import { useLockscreen } from '@solid-ui/hooks';
import { addUnit, classNames } from '@solid-ui/utils';
import { nextTick } from '@solid-ui/utils';
import { Icon } from '../../icon';
import { Overlay } from '../../overlay';
import { DialogInstance, DialogProps } from './props';
import { Position } from 'packages/hooks/type';


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

