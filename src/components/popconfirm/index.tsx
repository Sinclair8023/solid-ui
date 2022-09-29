import { Component, mergeProps, splitProps } from 'solid-js';
import { useNamespace } from '/@/effect-hooks/use-namespace';
import { useLocale } from '/@/effect-hooks/use-locale';
import { addUnit, classNames } from '/@/utils/dom/style';
import type { PopperInstance, PopperProps } from '../popper';
import Button, { ButtonProps } from '../button/button';
import Icon from '../icon';
import Popover from '../popover';

export interface PopconfirmProps extends Omit<PopperProps, 'content'> {
  title?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonType?: ButtonProps['type'] | 'text';
  cancelButtonType?: ButtonProps['type'] | 'text';
  icon?: string;
  iconColor?: string;
  onConfirm?: (e: Event) => Promise<void> | void;
  onCancel?: (e: Event) => Promise<void> | void;
  width?: number;
}

const defaultProps: Partial<PopconfirmProps> = {
  confirmButtonType: 'primary',
  cancelButtonType: 'text',
  iconColor: '#f90',
  icon: 'ep:question-filled',
  hideAfter: 200,
  width: 150,
  trigger: 'click'
};

const Popconfirm: Component<PopconfirmProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('popconfirm');
  const [localProps, popperProps] = splitProps(props, ['class', 'style', 'title', 'confirmButtonText', 'confirmButtonType', 'cancelButtonText', 'cancelButtonType', 'icon', 'iconColor', 'onConfirm', 'onCancel', 'width'])
  const { t } = useLocale();
  const style = () => ({ width: addUnit(localProps.width), ...localProps.style });
  let popper: PopperInstance;

  const finalConfirmButtonText = () => localProps.confirmButtonText || t('el.popconfirm.confirmButtonText')
  const finalCancelButtonText = () => localProps.cancelButtonText || t('el.popconfirm.cancelButtonText')

  const hidePopper = () => {
    popper.hide();
  }

  const confirm = (e: Event) => {
    localProps.onConfirm?.(e)
    hidePopper()
  }
  const cancel = (e: Event) => {
    localProps.onCancel?.(e)
    hidePopper()
  }

  return <Popover
    ref={ref => popper = ref}
    class={classNames(classNames(ns.b()), localProps.class)}
    {...popperProps}
    style={style()}
    content={<div class={ns.b()}>
      <div class={ns.e('main')}>
        {localProps.icon && <Icon class={ns.e('icon')} icon={localProps.icon} color={localProps.iconColor} />}
        {localProps.title}
      </div>
      <div class={ns.e('action')}>
        <Button
          size="small"
          type={localProps.cancelButtonType === 'text' ? undefined : localProps.cancelButtonType}
          text={localProps.cancelButtonType === 'text'}
          onClick={cancel}
        >
          {finalCancelButtonText}
        </Button>
        <Button
          size="small"
          type={localProps.confirmButtonType === 'text' ? undefined : localProps.confirmButtonType}
          text={localProps.confirmButtonType === 'text'}
          onClick={confirm}
        >
          {finalConfirmButtonText}
        </Button>
      </div>
    </div>} />
}

export default Popconfirm;

