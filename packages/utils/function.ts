import { isFunction } from 'lodash-es';
import { Accessor } from 'solid-js';

export type MaybeAccessor<T> = Accessor<T | undefined> | T | undefined;

export type MaybeElementAccessor = MaybeAccessor<Element>;

export type PointerType = 'mouse' | 'touch' | 'pen';

export interface Position {
  x: number;
  y: number;
}

export function unAccessor<T>(el: MaybeAccessor<T>) {
  return isFunction(el) ? el() : el;
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const nextTick = (cb?: Fn) => (cb ? sleep(0).then(cb) : sleep(0));
