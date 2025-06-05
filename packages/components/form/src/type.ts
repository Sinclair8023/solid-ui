import { RuleItem, ValidateError, ValidateFieldsError } from 'async-validator';
import { Accessor, JSX } from 'solid-js';
import { ComponentSize } from '@solid-ui/constants';

export interface FormItemRule extends RuleItem {
  trigger?: Arrayable<string>;
}
export type FormRules = Partial<Record<string, Arrayable<FormItemRule>>>;

export type FormValidationResult = Promise<boolean>;
export type FormValidateCallback = (
  isValid: boolean,
  invalidFields?: ValidateFieldsError
) => void;
export interface FormValidateFailure {
  errors: ValidateError[] | null;
  fields: ValidateFieldsError;
}
export type FormItemValidateState = 'error' | 'validating' | 'success' | '';

export interface FormItemProps {
  ref?: FormItemContextInstance | ((el: FormItemContextInstance) => void);
  label?: string;
  labelWidth?: number | string;
  prop?: string | string[];
  required?: boolean;
  rules?: Arrayable<FormItemRule>;
  error?: string;
  validateStatus?: FormItemValidateState;
  for?: string;
  inlineMessage?: string | boolean;
  showMessage?: boolean;
  size?: ComponentSize;
  children?: JSX.Element;
}

export interface FormItemInstance {
  $el?: HTMLDivElement | undefined;
  validateState: Accessor<FormItemValidateState>;
  // addInputId: (id: string) => void
  // removeInputId: (id: string) => void;
  validate: (
    trigger: string,
    callback?: FormValidateCallback
  ) => FormValidationResult;
  // resetField(): void;
  clearValidate(): void;
}
export type FormItemContextInstance = FormItemProps & FormItemInstance;

export interface FormInstance {
  addField: (field: FormItemContextInstance) => void;
  removeField: (field: FormItemContextInstance) => void;
  // 和vue不同，Form不能优雅的拿到model的set方法，所以在Form组件内部不支持对model数据进行修改。
  // resetFields: (fields: Arrayable<FormItemContextInstance>) => void
  clearValidate: (field?: Arrayable<FormItemContextInstance>) => void;
  validateField: (
    field?: Arrayable<FormItemContextInstance>,
    callback?: FormValidateCallback
  ) => FormValidationResult;
  validate: (callback?: FormValidateCallback) => FormValidationResult;
}

export interface FormProps {
  ref?: FormInstance | (() => FormInstance);
  model: Recordable;
  rules?: Partial<Record<string, Arrayable<FormItemRule>>>;
  labelPosition?: 'left' | 'right' | 'top';
  requireAsteriskPosition?: 'left' | 'right';
  labelWidth?: number | string;
  labelffix?: string;
  inline?: boolean;
  inlineMessage?: boolean;
  statusIcon?: boolean;
  showMessage?: boolean;
  size?: ComponentSize;
  disabled?: boolean;
  validateOnRuleChange?: boolean;
  hideRequiredAsterisk?: boolean;
  scrollToError?: boolean;
  children?: JSX.Element;
  onValidate?: (
    prop: Arrayable<string>,
    isValid: boolean,
    message: string
  ) => void;
}

export type FormContextInstance = FormProps & FormInstance;
