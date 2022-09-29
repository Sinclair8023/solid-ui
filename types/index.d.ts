declare type Nullable<T> = T | null;

declare type Arrayable<T> = T | T[];
declare type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

declare type Recordable<T = any> = Record<string, T>;

declare type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T;
};

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

