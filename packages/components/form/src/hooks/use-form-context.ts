import { createContext, useContext } from 'solid-js';
import { FormContextInstance } from '../type';

export const FormContext = createContext<FormContextInstance>();

export function useFormContext() {
  return useContext(FormContext);
}
