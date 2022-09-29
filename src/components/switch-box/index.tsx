import { isBoolean } from 'lodash-es';
import { Accessor, Component, createEffect, createMemo, JSX, mergeProps, on, Show } from 'solid-js';
import Icon from '../icon';
import { ComponentSize } from '/@/constants/size';
import { EVENT_CODE } from "/@/constants/aria"
import { useDisabled, useSize } from '/@/effect-hooks/use-comon-props';
import { useNamespace } from '/@/effect-hooks/use-namespace';
import { addUnit, classNames, mergeStyle } from '/@/utils/dom/style';
import { debugWarn, throwError } from '/@/utils/error';
import { nextTick } from '/@/utils/function';
import { isPromise } from '/@/utils/is';
import { useFormItem } from '/@/effect-hooks/use-form-item';
type SwitchValue = boolean | string | number
export interface SwitchProps extends JSX.HTMLAttributes<SwitchInstance> {
  value?: SwitchValue;
  disabled?: boolean;
  loading?: boolean;
  width?: string | number;
  inlinePrompt?: boolean;
  activeIcon?: string;
  inactiveIcon?: string;
  activeText?: string;
  activeValue?: SwitchValue;
  inactiveText?: string;
  inactiveValue?: SwitchValue;
  activeColor?: string;
  inactiveColor?: string;
  borderColor?: string;
  size?: ComponentSize;
  validateEvent?: boolean;
  beforeChange?: () => Promise<boolean> | boolean;
  onChange?: (val: SwitchValue) => void;
}

export interface SwitchInstance {
  focus: () => void;
  checked: Accessor<boolean>;
}

const defaultProps: Partial<SwitchProps> = {
  value: false,
  activeValue: true,
  inactiveValue: false,
  validateEvent: true,
};

const Switch: Component<SwitchProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const ns = useNamespace('switch');
  const size = useSize(props);
  const disabled = useDisabled(props, () => props.loading);
  const checked = createMemo(() => props.value === props.activeValue);
  let inputRef: HTMLInputElement;
  const { formItem } = useFormItem();
  if (formItem) {
    createEffect(on(checked, () => {
      if (props.validateEvent) {
        formItem.validate('change').catch((err) => debugWarn(err))
      }
    }, { defer: true }))
  }
  if (props.ref) {
    (props.ref as (ref: SwitchInstance) => void )({
      focus,
      checked,
    })
  }

  const style = () => {
    return mergeStyle(props.style, ns.cssVarBlock({
      ...(props.activeColor ? { 'on-color': props.activeColor } : null),
      ...(props.inactiveColor ? { 'off-color': props.inactiveColor } : null),
      ...(props.borderColor ? { 'border-color': props.borderColor } : null),
    }))
  }
  const coreStyle = () => ({
    width: addUnit(props.width)
  })

  function focus() {
    inputRef?.focus?.();
  }
  function handleChange() {
    const value = checked() ? props.inactiveValue : props.activeValue;
    props.onChange?.(value!);
    nextTick(() => {
      inputRef.checked = checked();
    })
  }
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === EVENT_CODE.enter) {
      switchValue()
    }
  }

  function switchValue() {
    if (disabled()) return

    const { beforeChange } = props
    if (!beforeChange) {
      handleChange()
      return
    }

    const shouldChange = beforeChange()

    const isPromiseOrBool = [
      isPromise(shouldChange),
      isBoolean(shouldChange),
    ].includes(true)
    if (!isPromiseOrBool) {
      throwError(
        'Switch',
        'beforeChange must return type `Promise<boolean>` or `boolean`'
      )
    }

    if (isPromise(shouldChange)) {
      shouldChange
        .then((result) => {
          if (result) {
            handleChange()
          }
        })
        .catch((e) => {
          debugWarn('Switch', `some error occurred: ${e}`)
        })
    } else if (shouldChange) {
      handleChange()
    }
  }
  return <div
    class={classNames(ns.b(), ns.m(size()), ns.is('disabled', disabled()), ns.is('checked', checked()))}
    style={style()}
    onClick={switchValue}
  >
    <input
      ref={ref => inputRef = ref}
      class={ns.e('input')}
      type="checkbox"
      role="switch"
      aria-checked={checked()}
      aria-disabled={disabled()}
      true-value={props.activeValue}
      false-value={props.inactiveValue}
      disabled={disabled()}
      onChange={handleChange}
      onKeyDown={handleKeydown}
    />
    <Show when={!props.inlinePrompt && (props.inactiveText || props.inactiveIcon)}>
      <span class={classNames(ns.e('label'), ns.em('label', 'left'), ns.is('active', !checked()))}>
        {props.inactiveIcon && <Icon icon={props.inactiveIcon} />}
        {props.inactiveText && !props.inactiveIcon && <span>{props.inactiveText}</span>}
      </span>
    </Show>
    <span class={ns.e('core')} style={coreStyle()}>
      <Show when={props.inlinePrompt}>
        <div class={ns.e('inner')}>
          {props.activeIcon && <Icon icon={props.activeIcon} class={classNames(ns.is('icon'), checked() ? ns.is('show') : ns.is('hide'))} />}
          {props.inactiveIcon && <Icon icon={props.inactiveIcon} class={classNames(ns.is('icon'), !checked() ? ns.is('show') : ns.is('hide'))} />}
          {props.activeText && <span class={classNames(ns.is('text'), checked() ? ns.is('show') : ns.is('hide'))}>
            {props.activeText.substring(0, 3)}
          </span>}
          {props.inactiveText && <span class={classNames(ns.is('text'), !checked() ? ns.is('show') : ns.is('hide'))}>
            {props.inactiveText.substring(0, 3)}
          </span>}
        </div>
      </Show>
      <div class={ns.e('action')}>
        {props.loading && <Icon class={ns.is('loading')} icon="ep:loading" />}
      </div>
    </span>
    <Show when={!props.inlinePrompt && (props.activeIcon || props.activeText)}>
      <span class={classNames(ns.e('label'), ns.em('label', 'right'), ns.is('active', checked()))}>
        {props.activeIcon && <Icon icon={props.activeIcon} />}
        {!props.activeIcon && props.activeText && <span>{props.activeText}</span>}
      </span>
    </Show>
  </div>
}

export default Switch;

