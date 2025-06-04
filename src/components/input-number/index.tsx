import { isNil, isNumber, isString, isUndefined } from "lodash-es";
import { Component, createEffect, createSignal, JSX, mergeProps, on, Show } from "solid-js";
import Icon from "../icon";
import Input, { InputInstance } from "../input";
import { ComponentSize } from "@/constants/size";
import { useDisabled, useSize } from "@/effect-hooks/use-comon-props";
import { useFormItem } from "@/effect-hooks/use-form-item";
import { useLocale } from "@/effect-hooks/use-locale";
import { useNamespace } from "@/effect-hooks/use-namespace";
import { classNames } from "@/utils/dom/style";
import { debugWarn } from "@/utils/error";

export interface InputNUmberInstance {
  focus: () => void;
  blur: () => void;
}

export interface InputNumberProps {
  ref?: InputNUmberInstance | ((ref: InputNUmberInstance) => void)
  class?: string;
  style?: JSX.CSSProperties;
  step?: number;
  stepStrictly?: boolean;
  max?: number;
  min?: number;
  value?: number;
  disabled?: boolean;
  size?: ComponentSize;
  controls?: boolean;
  controlsPosition?: '' | 'right';
  valueOnClear?: 'min' | 'max' | number;
  label?: string;
  placeholder?: string;
  precision?: number;
  validateEvent?: boolean;
  onChange?: (value?: number) => void;
  onInput?: (value?: number) => void;
  onFocus?: (e: MouseEvent | FocusEvent) => void;
  onBlur?: (e: MouseEvent | FocusEvent) => void;
}

const defaultProps: Partial<InputNumberProps> = {
  step: 1,
  max: Number.POSITIVE_INFINITY,
  min: Number.NEGATIVE_INFINITY,
  controls: true,
  controlsPosition: '',
  validateEvent: true,
};



const InputNumber: Component<InputNumberProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);

  const { t } = useLocale();
  const ns = useNamespace('input-number');
  let input: InputInstance | undefined;

  const [value, setValue] = createSignal(props.value);
  const [userInput, setUserInput] = createSignal<string>();

  createEffect(on(() => props.value, (val) => {
    setValue(val);
    setUserInput(undefined)
  }, { defer: true }))



  const { formItem } = useFormItem();

  const minDisabled = () => isNumber(props.value) && props.min !== undefined && ensurePrecision(props.value, -1)! < props.min;

  const maxDisabled = () => isNumber(props.value) && props.max !== undefined && ensurePrecision(props.value)! > props.max

  const controlsAtRight = () => props.controls && props.controlsPosition === 'right'

  const numPrecision = () => {
    const stepPrecision = getPrecision(props.step)
    if (!isUndefined(props.precision)) {
      if (stepPrecision > props.precision) {
        debugWarn(
          'InputNumber',
          'precision should not be less than the decimal places of step'
        )
      }
      return props.precision
    } else {
      return Math.max(getPrecision(props.value), stepPrecision)
    }
  }

  const size = useSize(props);
  const disabled = useDisabled(props);

  const displayValue = (): string | undefined => {

    if (userInput() !== undefined) {
      return userInput()
    }
    let currentValue: string | number | undefined = value();
    if (isNil(currentValue)) return ''
    if (isNumber(currentValue)) {
      if (Number.isNaN(currentValue)) return ''
      if (!isUndefined(props.precision)) {
        currentValue = currentValue.toFixed(props.precision)
      }
    }
    return currentValue as string
  }
  const toPrecision = (num: number, pre?: number) => {
    if (isUndefined(pre)) pre = numPrecision();
    if (pre === 0) return Math.round(num)
    let snum = String(num)
    const pointPos = snum.indexOf('.')
    if (pointPos === -1) return num
    const nums = snum.replace('.', '').split('')
    const datum = nums[pointPos + pre]
    if (!datum) return num
    const length = snum.length
    if (snum.charAt(length - 1) === '5') {
      snum = `${snum.slice(0, Math.max(0, length - 1))}6`
    }
    return Number.parseFloat(Number(snum).toFixed(pre))
  }
  const getPrecision = (value: number | undefined) => {
    if (isNil(value)) return 0
    const valueString = value.toString()
    const dotPosition = valueString.indexOf('.')
    let precision = 0
    if (dotPosition !== -1) {
      precision = valueString.length - dotPosition - 1
    }
    return precision
  }
  const ensurePrecision = (val: number, coefficient: 1 | -1 = 1) => {
    if (!isNumber(val)) return value()
    // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
    return toPrecision(val + props.step! * coefficient)
  }
  const increase = () => {
    if (disabled() || maxDisabled()) return
    const value = props.value || 0
    const newVal = ensurePrecision(value)
    setCurrentValue(newVal)
  }
  const decrease = () => {
    if (disabled() || minDisabled()) return
    const value = props.value || 0
    const newVal = ensurePrecision(value, -1)
    setCurrentValue(newVal)
  }
  const verifyValue = (
    value: number | string | undefined,
    update?: boolean
  ): number | undefined => {
    const { max, min, step, precision, stepStrictly, valueOnClear } = props
    let newVal: number | undefined = Number(value)
    if (isNil(value) || Number.isNaN(newVal)) {
      return undefined
    }
    if (value === '') {
      if (valueOnClear === undefined) {
        return undefined
      }
      newVal = isString(valueOnClear) ? { min, max }[valueOnClear]! : valueOnClear!
    }
    if (stepStrictly) {
      newVal = toPrecision(Math.round(newVal / step!) * step!, precision)
    }
    if (!isUndefined(precision)) {
      newVal = toPrecision(newVal, precision)
    }
    if (newVal > max! || newVal < min!) {
      newVal = newVal > max! ? max : min;
      update && props.onChange?.(newVal);
    }
    return newVal
  }
  const setCurrentValue = (val: number | string | undefined) => {
    const oldVal = value()
    const newVal = verifyValue(val)
    if (oldVal === newVal) return

    setValue(newVal);
    setUserInput(undefined)

    props.onChange?.(newVal);
    props.onInput?.(newVal);

    if (props.validateEvent) {
      formItem?.validate?.('change').catch((err) => debugWarn(err))
    }
  }
  const handleInput = (val: string) => {
    setUserInput(val)
  }
  const handleInputChange = (val: string) => {
    const newVal = val !== '' ? Number(val) : ''
    if ((isNumber(newVal) && !Number.isNaN(newVal)) || val === '') {
      setCurrentValue(newVal)
    }
    setUserInput(undefined);
  }
  const handleFocus = (event: MouseEvent | FocusEvent) => {
    props.onFocus?.(event)
  }
  const handleBlur = (event: MouseEvent | FocusEvent) => {
    props.onBlur?.(event)
    if (props.validateEvent) {
      formItem?.validate?.('blur').catch().catch((err) => debugWarn(err))
    }
  }

  return <div
    class={classNames(props.class,
      ns.b(),
      ns.m(size()),
      ns.is('disabled', props.disabled),
      ns.is('without-controls', !props.controls),
      ns.is('controls-right', props.controls && props.controlsPosition === 'right')
    )}
    style={props.style}
  >
    <Show when={props.controls}>
      <span class={classNames(ns.e('decrease'), ns.is('disabled', minDisabled()))}
        role="button"
        aria-label={t('el.inputNumber.decrease')}
        onClick={decrease}
      >
        <Icon icon={controlsAtRight() ? 'ep:arrow-down' : 'ep:minus'} />
      </span>
      <span class={classNames(ns.e('increase'), ns.is('disabled', minDisabled()))}
        role="button"
        aria-label={t('el.inputNumber.increase')}
        onClick={increase}
      >
        <Icon icon={controlsAtRight() ? 'ep:arrow-up' : 'ep:plus'} />
      </span>
    </Show>
    <Input
      ref={input}
      type="number"
      step={props.step}
      value={displayValue()}
      placeholder={props.placeholder}
      size={size()}
      disabled={disabled()}
      min={props.min}
      max={props.max}
      validate-event={false}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onInput={handleInput}
      onChange={handleInputChange}
    />
  </div>
}

export default InputNumber
