import AsyncValidator from 'async-validator'
import type { RuleItem } from 'async-validator';
import { castArray, get, isBoolean, isFunction, isString } from 'lodash-es';
import { Component, createEffect, createMemo, createSignal, mergeProps, on, onCleanup, onMount, Show } from 'solid-js';
import { useGlobalConfig } from '/@/effect-hooks/use-global-config';
import { useNamespace } from '/@/effect-hooks/use-namespace';
import { createDebouncedSignal } from '/@/hooks/create-debounced-signal';
import { addUnit, classNames } from '/@/utils/dom/style';
import { FormItemContextInstance, FormItemProps, FormItemRule, FormItemValidateState, FormValidateCallback, FormValidateFailure } from './type';
import { useFormContext } from './useFormContext';
import { FormItemContext, useFormItemContext } from './useFormItemContext';


const defaultProps: Partial<FormItemProps> = {
  showMessage: true
};
const FormItem: Component<FormItemProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  const formContext = useFormContext();
  const parentFormItemContext = useFormItemContext();
  const isNested = !!parentFormItemContext;

  const config = useGlobalConfig();
  const ns = useNamespace('form-item');

  const [validateState, setValidateState] = createDebouncedSignal<FormItemValidateState>('');
  const [validateMessage, setValidateMessage] = createSignal('');

  createEffect(on(() => props.error, (val) => {
    setValidateMessage(val || '')
    setValidateState(val ? 'error' : '')
  }))
  createEffect(on(() => props.validateStatus, (val) => setValidateState(val || '')));
  onMount(() => {
    if (props.prop) {
      formContext?.addField(context);
    }
  })
  onCleanup(() => {
    formContext?.removeField(context);
  })
  const context: FormItemContextInstance = {
    validateState,
    clearValidate,
    validate,
  }

  let isResettingField = false

  const size = () => props.size || config.size;
  const labelStyle = () => {
    if (formContext?.labelPosition === 'top') {
      return {}
    }
    const labelWidth = addUnit(props.labelWidth || formContext?.labelWidth || '');
    if (labelWidth) return { width: labelWidth }
    return {}
  }
  const isGroup = () => props.label

  const contentStyle = () => {
    if (formContext?.labelPosition === 'top' || formContext?.inline) {
      return {}
    }
    if (!props.label && !props.labelWidth && isNested) {
      return {}
    }
    const labelWidth = addUnit(props.labelWidth || formContext?.labelWidth || '')
    if (!props.label) {
      return { marginLeft: labelWidth }
    }
    return {}
  }

  const inlineMessage = () => isBoolean(props.inlineMessage) ? props.inlineMessage : formContext?.inlineMessage || false
  const propString = () => {
    if (!props.prop) return ''
    return isString(props.prop) ? props.prop : props.prop.join('.')
  }

  const fieldValue = () => {
    const model = formContext?.model;
    if (!model || !props.prop) {
      return
    }
    return get(model, props.prop);
  }
  const normalizedRules = createMemo(() => {
    const { required } = props

    const rules: FormItemRule[] = []

    if (props.rules) {
      rules.push(...castArray(props.rules))
    }

    const formRules = formContext?.rules
    if (formRules && props.prop) {
      const _rules = get(formRules, props.prop);
      if (_rules) {
        rules.push(...castArray(_rules))
      }
    }

    if (required !== undefined) {
      const requiredRules = rules
        .map((rule, i) => [rule, i] as const)
        .filter(([rule]) => Object.keys(rule).includes('required'))

      if (requiredRules.length > 0) {
        for (const [rule, i] of requiredRules) {
          if (rule.required === required) continue
          rules[i] = { ...rule, required }
        }
      } else {
        rules.push({ required })
      }
    }

    return rules
  })

  const validateEnabled = () => normalizedRules().length > 0;

  const getFilteredRule = (trigger: string) => {
    const rules = normalizedRules()
    return (
      rules
        .filter((rule) => {
          if (!rule.trigger || !trigger) return true
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.includes(trigger)
          } else {
            return rule.trigger === trigger
          }
        })
        // exclude trigger
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ trigger, ...rule }): RuleItem => rule)
    )
  }
  const isRequired = () => normalizedRules().some((rule) => rule.required);

  const shouldShowError = () =>
    validateState() === 'error' &&
    props.showMessage &&
    (formContext?.showMessage ?? true)

  const currentLabel = () => `${props.label || ''}${formContext?.labelSuffix || ''}`;

  function onValidationFailed(error: FormValidateFailure) {
    const { errors, fields } = error
    if (!errors || !fields) {
      console.error(error)
    }

    setValidateState('error');
    const errmsg = errors
      ? errors?.[0]?.message ?? `${props.prop} is required`
      : ''
    setValidateMessage(errmsg)
    formContext?.onValidate?.(props.prop!, false, errmsg);
  }

  function onValidationSucceeded() {
    setValidateState('success');
    formContext?.onValidate?.(props.prop!, true, '');
  }

  function doValidate(rules: RuleItem[]) {
    const modelName = propString();
    const validator = new AsyncValidator({
      [modelName]: rules,
    })
    return validator
      .validate({ [modelName]: fieldValue() }, { firstFields: true })
      .then(() => {
        onValidationSucceeded()
        return true as const
      })
      .catch((err: FormValidateFailure) => {
        onValidationFailed(err as FormValidateFailure)
        return Promise.reject(err)
      })
  }

  async function validate(trigger: string, callback?: FormValidateCallback) {
    // skip validation if its resetting
    if (isResettingField) {
      return false
    }

    const hasCallback = isFunction(callback)
    if (!validateEnabled()) {
      callback?.(false)
      return false
    }

    const rules = getFilteredRule(trigger)
    if (rules.length === 0) {
      callback?.(true)
      return true
    }

    setValidateState('validating')

    return doValidate(rules)
      .then(() => {
        callback?.(true)
        return true as const
      })
      .catch((err: FormValidateFailure) => {
        const { fields } = err
        callback?.(false, fields)
        return hasCallback ? false : Promise.reject(fields)
      })
  }

  function clearValidate() {
    setValidateState('')
    setValidateMessage('')
    isResettingField = false;
  }
  const propsRef = props.ref as (el: FormItemContextInstance) => void;
  propsRef?.(context);
  return <FormItemContext.Provider value={context}>
    <div ref={ref => context.$el = ref}
      class={
        classNames(ns.b(),
          ns.m(size()),
          ns.is(validateState()),
          ns.is('required', props.required || isRequired()),
          ns.is('no-asterisk', formContext?.hideRequiredAsterisk),
          formContext?.requireAsteriskPosition === 'right'
            ? 'asterisk-right'
            : 'asterisk-left',
          { [ns.m('feedback')]: formContext?.statusIcon }
        )
      }

      role={isGroup() ? 'group' : undefined}>
      <label class={ns.e('label')} style={labelStyle()}>
        {currentLabel()}
      </label>
      <div class={ns.e('content')} style={contentStyle()}>
        {props.children}
        <Show when={shouldShowError()}>
          <div class={classNames(ns.e('error'), { [ns.em('error', 'inline')]: inlineMessage() })}>
            {validateMessage()}
          </div>
        </Show>
      </div>
    </div>
  </FormItemContext.Provider>
}

export default FormItem;
