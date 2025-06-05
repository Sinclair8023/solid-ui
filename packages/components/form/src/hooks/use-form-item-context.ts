import { createContext, useContext } from 'solid-js';
import { FormItemContextInstance } from '../type';

export const FormItemContext = createContext<FormItemContextInstance>();

export function useFormItemContext() {
  return useContext(FormItemContext);
}
