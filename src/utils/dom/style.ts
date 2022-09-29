import { camelCase, isNumber, isObject, isString } from "lodash-es"
import { JSX } from "solid-js";
import { isServer } from "solid-js/web";
import { debugWarn } from "../error";
const SCOPE = 'utils/dom/style';

export const classNameToArray = (cls = '') =>
  cls.split(' ').filter((item) => !!item.trim())

export const hasClass = (el: Element, cls: string): boolean => {
  if (!el || !cls) return false
  if (cls.includes(' ')) throw new Error('className should not contain space.')
  return el.classList.contains(cls)
}
export const addClass = (el: Element, cls: string) => {
  if (!el || !cls.trim()) return
  el.classList.add(...classNameToArray(cls))
}

export const removeClass = (el: Element, cls: string) => {
  if (!el || !cls.trim()) return
  el.classList.remove(...classNameToArray(cls))
}

export function classNames(...cls: (string | null | undefined | Record<string, unknown>)[]) {
  const classList: string[] = [];
  cls?.forEach(item => {
    if (!item) {
      return;
    }
    if (isString(item)) {
      classList.push(item)
    } else if (isObject(item)) {
      Object.keys(item).forEach(key => item[key] && classList.push(key))
    }
  });
  return classList.join(' ');
}

export const getStyle = (
  element: HTMLElement,
  styleName: keyof CSSStyleDeclaration
): string => {
  if (isServer || !element || !styleName) return ''

  let key = camelCase(styleName as string)
  if (key === 'float') key = 'cssFloat'
  try {
    const style = (element.style as any)[key]
    if (style) return style
    const computed: any = document.defaultView?.getComputedStyle(element, '')
    return computed ? computed[key] : ''
  } catch {
    return (element.style as any)[key]
  }
}


export function mergeStyle(...args: Array<JSX.CSSProperties | string | undefined>) {
  const style: Record<string, number | string> = {};
  args.forEach(item => {
    if (isString(item)) {
      item.split(';').reduce((o, i) => {
        const [key, val] = i.split(':');
        o[key] = val;
        return o
      }, style)
    } else if (isObject(item)) {
      Object.assign(style, item)
    }
  })
  return style as JSX.CSSProperties
}

export function addUnit(value?: string | number, defaultUnit = 'px') {
  if (!value) return ''
  if (isString(value)) {
    return value
  } else if (isNumber(value)) {
    return `${value}${defaultUnit}`
  }
  debugWarn(SCOPE, 'binding value must be a string or number')
}
