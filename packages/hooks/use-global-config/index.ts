import { createContext, useContext } from 'solid-js';

import { ComponentSize } from '@solid-ui/constants';
import { Language } from '@solid-ui/locale';

const defaultContext: Partial<GlobalConfig> = { size: 'default' };
export interface GlobalConfig {
  size?: ComponentSize;
  zIndex?: number;
  button?: {
    autoInsertSpace?: boolean;
  };
  locale?: Language;
}
export const GlobalConfigContext = createContext<GlobalConfig>(defaultContext);
export function useGlobalConfig<
  K extends keyof GlobalConfig,
  D extends GlobalConfig[K]
>(key: K, defaultValue?: D): Exclude<GlobalConfig[K], undefined> | D;
export function useGlobalConfig(): GlobalConfig;
export function useGlobalConfig(
  key?: keyof GlobalConfig,
  defaultValue = undefined
) {
  const config = useContext(GlobalConfigContext);
  return key ? config[key] ?? defaultValue : config;
}
