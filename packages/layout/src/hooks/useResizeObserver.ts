import { useEffect, useRef, useState } from "react";

export interface ElementSize {
  width: number;
  height: number;
}

const ZERO: ElementSize = { width: 0, height: 0 };

/**
 * Observe an element's size.
 *
 * Returns a plain `{ width, height }` rather than the observer's own
 * `contentRect`. A `DOMRectReadOnly` is a fresh object on every callback, so
 * `setState` could never take React's identity bail-out: the component and its
 * whole subtree re-rendered on every entry, including the many where nothing
 * had actually changed. During a drag-resize, or while a mobile browser
 * collapses its toolbar mid-scroll, that is a render per event.
 */
export function useResizeObserver(ref: React.RefObject<Element | null>) {
  const [size, setSize] = useState<ElementSize>(ZERO);
  const sizeRef = useRef<ElementSize>(ZERO);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;

      // `borderBoxSize` is reported by the observer; `getBoundingClientRect`
      // here would be a layout read inside a layout callback.
      const box = entry.borderBoxSize?.[0];
      const next = box
        ? { width: box.inlineSize, height: box.blockSize }
        : { width: entry.contentRect.width, height: entry.contentRect.height };

      const prev = sizeRef.current;
      if (prev.width === next.width && prev.height === next.height) return;

      sizeRef.current = next;
      setSize(next);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
