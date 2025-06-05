import { createMemo } from 'solid-js';
import { ComponentSize } from '@solid-ui/constants/size';
import { MaybeAccessor, unAccessor } from '@solid-ui/hooks/type';
import { useFormItem } from './use-form-item';
import { useGlobalConfig } from '@solid-ui/hooks';

export function useSize(
  props: { size?: ComponentSize },
  fallback?: MaybeAccessor<ComponentSize>
) {
  const { form, formItem } = useFormItem();
  return createMemo(
    () =>
      props.size ||
      unAccessor(fallback) ||
      formItem?.size ||
      form?.size ||
      useGlobalConfig('size')
  );
}

export function useDisabled(
  props: { disabled?: boolean },
  fallback?: MaybeAccessor<boolean>
) {
  const { form } = useFormItem();
  return createMemo(
    () => props.disabled || unAccessor(fallback) || form?.disabled
  );
}
