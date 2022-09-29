import { useFormContext } from "/@/components/form/useFormContext";
import { useFormItemContext } from "/@/components/form/useFormItemContext";

export function useFormItem() {
  const form = useFormContext()
  const formItem = useFormItemContext()
  return {
    form,
    formItem
  }
}
