import { Component, createEffect, createSignal, mergeProps, Show } from 'solid-js';
import { isServer, Portal } from 'solid-js/web';
import { Transition } from 'solid-transition-group';
import type { DialogInstance, DialogProps } from '../dialog';
import Icon from '../icon';
import Overlay from '../overlay';
import { useLocale } from '/@/effect-hooks/use-locale';
import { useNamespace } from '/@/effect-hooks/use-namespace';
import { useZIndex } from '/@/effect-hooks/use-z-index';
import { useEscapeKeydown } from '/@/hooks/use-escape-keydown';
import { useLockscreen } from '/@/hooks/use-lockscreen';
import { addUnit, classNames } from '/@/utils/dom/style';
import { nextTick } from '/@/utils/function';

export interface DrawerProps extends Omit<DialogProps, 'draggable'> {
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt';
  size?: string | number;
  withHeader?: boolean;
  // resizeable?: boolean;
  // fullscreenable?: boolean;
}

export type DrawerInstance = DialogInstance

const defaultProps: Partial<DrawerProps> = {
  direction: 'rtl',
  size: '30%',
  closeIcon: 'ep:close',
  visible: true,
  mask: true,
  maskClosable: true,
  escClosable: true,
  showClose: true,
  lockScroll: true,
};

const Drawer: Component<DrawerProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('drawer');
  const { t } = useLocale();
  const [zIndex, setZIndex] = createSignal(props.zIndex || useZIndex());
  const [visible, setVisible] = createSignal(!!props.visible);
  // let drawerRef: HTMLDivElement;
  // let draggerRef: HTMLDivElement;

  const isHorizontal = () => props.direction === 'rtl' || props.direction === 'ltr'
  const style = () => {
    const size = addUnit(props.size);
    return isHorizontal() ? { width: size } : { height: size }
  }

  createEffect(() => {
    props.visible ? doOpen() : doClose();
  })

  if (props.escClosable) {
    useEscapeKeydown(handleClose)
  }
  if (props.lockScroll) {
    useLockscreen(visible);
  }

  {
    (props.ref as (el: DrawerInstance) => void)?.({
      open: doOpen,
      close: doClose,
      visible
    })
  }

  function doOpen() {
    if (isServer) return
    setZIndex(props.zIndex || useZIndex());
    setVisible(true);
  }
  function doClose() {
    setVisible(false);
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


  return <Portal mount={document.body}>
    <Transition name={ns.b('fade')} appear onAfterEnter={props.onOpen} onAfterExit={props.onClose}>
      <Show when={visible()}>
        <Overlay
          mask={props.mask}
          zIndex={zIndex()}
          onClick={handleMaskClick}
        >
          <div
            role="dialog"
            aria-model="true"
            class={classNames(ns.b(),
              props.direction,
              props.class,
            )}
            style={style()}
            onClick={e => e.stopPropagation()}
          >
            {/* {props.resizeable && <div class={ns.e('dragger')} ref={ref => draggerRef = ref}></div>} */}
            <header class={ns.e('header')}>
              <Show when={props.header} fallback={<span role="heading" class={ns.e('title')}> {props.title}</span>}>
                {props.header}
              </Show>
              <Show when={props.closeIcon && props.showClose}>
                <button aria-label={t('el.drawer.close')} class={ns.e('close-btn')} type="button" onClick={handleClose}>
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
        </Overlay>
      </Show>
    </Transition>
  </Portal>
}

export default Drawer;

