import {
  Position, MaybeAccessor, unAccessor
} from '../type'
import { createEffect, onCleanup, onMount } from 'solid-js'
import { addUnit } from '/@/utils/dom/style'

export interface UseDraggableOptions {
  /**
   * Only start the dragging when click on the element directly
   *
   * @default false
   */
  exact?: boolean

  allowDirection?: 'x' | 'y' | 'both'

  BoundaryAccessor?: MaybeAccessor<HTMLElement>

  targetAccessor?: MaybeAccessor<HTMLElement | false>

  /**
   * Initial position of the element.
   *
   * @default { x: 0, y: 0 }
   */
  initialValue?: Position

  /**
   * Callback when the dragging starts. Return `false` to prevent dragging.
   */
  onStart?: (position: Position, event: MouseEvent) => void | false

  /**
   * Callback during dragging.
   */
  onMove?: (position: Position, event: MouseEvent) => void

  /**
   * Callback when dragging end.
   */
  onEnd?: (position: Position, event: MouseEvent) => void
}

/**
 * Make elements draggable.
 *
 * @param target
 * @param options
 */
export function useDraggable(dragAccessor: MaybeAccessor<HTMLElement>, options: UseDraggableOptions = {}) {
  let transform = options.initialValue || {
    x: 0,
    y: 0,
  }
  let dragEl: HTMLElement;
  const onMousedown = (e: MouseEvent) => {
    const dragElement = unAccessor(dragAccessor)!
    if (options.exact && e.target !== dragElement) {
      return
    }
    const shouldDrag = options.onStart?.(transform, e) ?? true;
    if (!shouldDrag) {
      return
    }

    const downX = e.clientX
    const downY = e.clientY
    const { x, y } = transform

    const targetRect = dragElement.getBoundingClientRect();

    const BoundaryElement = unAccessor(options.BoundaryAccessor) || document.documentElement;
    const targetElement = unAccessor(options.targetAccessor) ?? dragElement;
    const allowDirection = options.allowDirection || 'both';

    const targetLeft = targetRect.left
    const targetTop = targetRect.top
    const targetWidth = targetRect.width
    const targetHeight = targetRect.height

    const clientWidth = BoundaryElement.clientWidth
    const clientHeight = BoundaryElement.clientHeight

    const minLeft = -targetLeft + x
    const minTop = -targetTop + y
    const maxLeft = clientWidth - targetLeft - targetWidth + x
    const maxTop = clientHeight - targetTop - targetHeight + y

    const onMousemove = (e: MouseEvent) => {
      const moveX = allowDirection !=='y' ? Math.min(
        Math.max(x + e.clientX - downX, minLeft),
        maxLeft
      ) : 0
      const moveY = allowDirection !== 'x' ? Math.min(
        Math.max(y + e.clientY - downY, minTop),
        maxTop
      ) : 0

      transform = {
        x: moveX,
        y: moveY,
      }
      if (targetElement) {
        targetElement.style.transform = `translate(${addUnit(
          moveX
        )}, ${addUnit(moveY)})`
      }
      options.onMove?.(transform, e);
    }

    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('mouseup', onMouseup)
      options.onEnd?.(transform, e);
    }

    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('mouseup', onMouseup)
  }

  const onDraggable = () => {
    if (unAccessor(dragAccessor)) {
      dragEl = unAccessor(dragAccessor)!;
      unAccessor(dragAccessor)!.addEventListener('mousedown', onMousedown)
    }
  }

  const offDraggable = () => {
    if (dragEl) {
      dragEl.removeEventListener('mousedown', onMousedown)
    }
  }

  onMount(() => {
    createEffect(() => {
      if (unAccessor(dragAccessor)) {
        onDraggable()
      } else {
        offDraggable()
      }
    })
  })
  onCleanup(() => offDraggable())
  return offDraggable
}
