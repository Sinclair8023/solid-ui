import { useGlobalConfig } from "../use-global-config"

let zIndex = 0;
export const useZIndex = () => {
  const initialZIndex = useGlobalConfig('zIndex', 2000);
  zIndex++;
  return zIndex + initialZIndex;
}
