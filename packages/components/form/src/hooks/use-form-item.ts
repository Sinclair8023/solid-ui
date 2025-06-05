import { useFormContext } from './use-form-context';
import { useFormItemContext } from './use-form-item-context';

export function useFormItem() {
  const form = useFormContext();
  const formItem = useFormItemContext();
  return {
    form,
    formItem,
  };
}
