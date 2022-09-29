
export const ComponentSizeMap = {
  large: 40,
  default: 32,
  small: 24,
} as const

export type ComponentSize = keyof typeof ComponentSizeMap;
