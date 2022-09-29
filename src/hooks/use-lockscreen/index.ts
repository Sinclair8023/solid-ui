import { Accessor, createEffect, on, onCleanup } from "solid-js";

export const useLockscreen = (trigger?: Accessor<boolean>) => {
  let isLocked = 0;
  const unlock = () => {
    if (isLocked) {
      isLocked & 1 && (document.body.style.overflowY = '');
      isLocked & 2 && (document.body.style.overflowX = '');
    }
    isLocked = 0;
  }

  const lock = () => {
    if (document.documentElement.clientHeight < document.body.scrollHeight) {
      isLocked += 1;
      document.body.style.overflowY = 'hidden';
    }
    if (document.documentElement.clientWidth < document.body.scrollWidth) {
      isLocked += 2;
      document.body.style.overflowX = 'hidden';
    }
  }
  if(trigger) {
    createEffect(on(trigger, val => val ? lock() : unlock()))
    onCleanup(unlock)
  }
  return [lock, unlock]
}
