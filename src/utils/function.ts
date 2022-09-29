
export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const nextTick = (cb?: Fn) => cb ? sleep(0).then(cb) : sleep(0);
