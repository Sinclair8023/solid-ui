import { get } from "lodash-es";
import { useGlobalConfig } from "../use-global-config"
import { Language } from "/@/locale";
import English from '/@/locale/lang/en';
export type TranslatorOption = Record<string, string | number>
export type Translator = (path: string, option?: TranslatorOption) => string

export const buildTranslator =
  (locale: Language): Translator =>
  (path, option) =>
    translate(path, option, locale)

export const translate = (
  path: string,
  option: undefined | TranslatorOption,
  locale: Language
): string =>
  (get(locale, path, path) as string).replace(
    /\{(\w+)\}/g,
    (_, key) => `${option?.[key] ?? `{${key}}`}`
  )


export function useLocale() {
  const locale = useGlobalConfig('locale', English);
  return {
    lang: locale.name,
    t: buildTranslator(locale)
  }
}
