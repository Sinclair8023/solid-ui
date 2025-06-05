import { Component, mergeProps, splitProps } from 'solid-js';
import { useNamespace } from '@solid-ui/hooks';
import { useLocale } from '@solid-ui/hooks';
import { addUnit, classNames } from '@solid-ui/utils';
import type { PopperInstance } from '../../popper';
import { Button } from '../../button';
import { Icon } from '../../icon';
import { Popover } from '../../popover';
import { PopconfirmProps } from './props';


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

