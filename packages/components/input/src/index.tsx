import { Component, createEffect, createSignal, Show, Switch, Match, on, mergeProps } from "solid-js";
import { ValiadteIconMap } from "@solid-ui/constants";
import { useFormItem } from "../../form";
import { useNamespace } from "@solid-ui/hooks";
import { classNames } from "@solid-ui/utils";
import { debugWarn } from "@solid-ui/utils";
import { Icon } from "../../icon";
import { useDisabled, useSize } from '../../form'
import { InputInstance, InputProps, TargetElement } from "./props";

type InputRefGetter = (el: InputInstance) => void

const defaultProps: Partial<InputProps> = {
  type: 'text',
  validateEvent: true,
}
const Input: Component<InputProps> = (_props) => {
  const props = mergeProps(defaultProps, _props);
  let input: HTMLInputElement | HTMLTextAreaElement;
  const nsInput = useNamespace('input');
  const nsTextarea = useNamespace('textarea');
  const [value, setValue] = createSignal(props.value || '');
  const [isComposing, setIsComposing] = createSignal(false);
  const [focused, setFocused] = createSignal(false);
  const [hovering, setHovering] = createSignal(false);
  const [passwordVisible, setPasswordVisible] = createSignal(false);

  const { form, formItem } = useFormItem();

  const inputSize = useSize(props)
  const inputDisabled = useDisabled(props)

  const showClear = () => props.clearable && !inputDisabled() && !!value() && (focused() || hovering())
  const showPwdVisible = () => props.showPassword && !inputDisabled() && value() && focused()
  const isWordLimitVisible = () => props.showWordLimit || !!props.maxLength && (props.type === 'text' || props.type === 'textarea') && !inputDisabled() && !props.showPassword;
  const inputExceed = () => isWordLimitVisible() && value().length > Number(props.maxLength)


  const needStatusIcon = () => form?.statusIcon ?? false
  const validateState = () => formItem?.validateState()
  const validateIcon = () => {
    const state = validateState();
    return state && ValiadteIconMap[state];
  }

  createEffect(on(() => props.value, () => {
    setValue(props.value || '')
    if (props.validateEvent) {
      formItem?.validate?.('change').catch((err) => debugWarn(err))
    }
  }, { defer: true }));

  const instance: InputInstance = {
    blur,
    focus,
    clear,
    select
  }
  const ref = props.ref as InputRefGetter;
  ref?.(instance);

  function getInputRef(ref: TargetElement) {
    input = ref;
    instance.input = ref;
  }
  function handleInput(event: InputEvent) {
    if (isComposing()) {
      return
    }
    props.onInput?.((event.target as TargetElement).value);
  }
  function handleChange(event: Event) {
    props.onChange?.((event.target as TargetElement).value);
  }
  function handleCompositionStart() {
    setIsComposing(true)
  }
  function handleCompositionEnd(event: CompositionEvent) {
    setIsComposing(false)
    handleInput(event as unknown as InputEvent);
  }
  function handleFocus(event: FocusEvent) {
    setFocused(true);
    props.onFocus?.(event)
  }
  function handleBlur(event: FocusEvent) {
    setFocused(false);
    props.onBlur?.(event);
    if (props.validateEvent) {
      formItem?.validate?.('blur').catch((err) => debugWarn(err))
    }
  }
  function handleMouseEnter() {
    setHovering(true)
  }
  function handleMouLeave() {
    setHovering(false)
  }
  function handlePasswordVisible() {
    setPasswordVisible(val => !val);
    focus()
  }
  function focus() {
    input?.focus()
  }
  function blur() {
    input?.blur()
  }
  function clear() {
    setValue(() => '');
    props.onInput?.('');
    props.onChange?.('');
  }
  function select() {
    input?.select()
  }

  return <div class={classNames(
    props.type === 'textarea' ? nsTextarea.b() : nsInput.b(),
    nsInput.m(inputSize()),
    nsInput.is('disabled', inputDisabled()),
    nsInput.is('exceed', inputExceed()),
    {
      [nsInput.b('group')]: props.append || props.prepend,
      [nsInput.bm('group', 'append')]: props.append,
      [nsInput.bm('group', 'prepend')]: props.prepend,
      [nsInput.m('prefix')]: props.prefix,
      // todo suffixIcon clearable
      [nsInput.m('suffix')]: props.suffix || props.showPassword,
      [nsInput.bm('suffix', 'password-clear')]: showClear() && showPwdVisible(),
    }
  )}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouLeave}
  >
    <Switch>
      <Match when={props.type === 'textarea'}>
        <textarea
          ref={getInputRef}
          disabled={inputDisabled()}
          value={value()}
          maxLength={props.maxLength}
          placeholder={props.placeholder}
          onInput={handleInput}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        ></textarea>
        <Show when={isWordLimitVisible()}>
          <span class={nsInput.e('count')}>{value().length} / {props.maxLength}</span>
        </Show>
      </Match>
      <Match when={props.type !== 'textarea'}>
        <Show when={props.prepend && props.type !== 'textarea'}>
          <div class={nsInput.be('group', 'prepend')}>
            {props.prepend}
          </div>
        </Show>
        <div class={classNames(nsInput.e('wrapper'), nsInput.is('focus', focused()))}>
          <Switch>
            <Match when={props.prefix}>
              <span class={nsInput.e('prefix')}>
                <span class={nsInput.e('prefix-inner')}>
                  {props.prefix}
                </span>
              </span>
            </Match>
            <Match when={props.prefixIcon}>
              <span class={nsInput.e('prefix')}>
                <span class={nsInput.e('prefix-inner')}>
                  <Icon icon={props.prefixIcon!} class={nsInput.e('prefix-icon')} />
                </span>
              </span>
            </Match>
          </Switch>
          <input
            ref={getInputRef}
            class={nsInput.e('inner')}
            type={props.showWordLimit ? passwordVisible() ? 'text' : 'password' : props.type}
            disabled={inputDisabled()}
            value={value()}
            min={props.min}
            max={props.max}
            name={props.name}
            step={props.step}
            maxLength={props.maxLength}
            placeholder={props.placeholder}
            onInput={handleInput}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
          <span class={nsInput.e('suffix')}>
            <span class={nsInput.e('suffix-inner')}>
              <Show when={(!showClear() || !showPwdVisible() || !isWordLimitVisible())}>
                {props.suffix}
                <Show when={props.suffixIcon}>
                  <Icon icon={props.suffixIcon!} class={nsInput.e('icon')} />
                </Show>
              </Show>
              <Show when={showClear()}>
                <Icon class={classNames(nsInput.e('icon'), nsInput.e('clear'))} icon="ep:circle-close" onClick={clear} />
              </Show>
              <Show when={showPwdVisible()}>
                <Icon class={classNames(nsInput.e('icon'), nsInput.e('password'))} icon={passwordVisible() ? 'ep:view' : 'ep:hide'} onClick={handlePasswordVisible} />
              </Show>
              <Show when={isWordLimitVisible()}>
                <span class={nsInput.e('count')}>
                  <span class={nsInput.e('count-inner')}>{value().length} / {props.maxLength}</span>
                </span>
              </Show>
              <Show when={validateState() && validateIcon() && needStatusIcon()}>
                <Icon icon={validateIcon()!} class={classNames(nsInput.e('icon'), nsInput.e('validateIcon'), nsInput.is('loading', validateState() === 'validating'))} />
              </Show>
            </span>
          </span>
        </div>
        <Show when={props.append}>
          <div class={nsInput.be('group', 'append')}>
            {props.append}
          </div>
        </Show>
      </Match>
    </Switch>
  </div>
}

export default Input
