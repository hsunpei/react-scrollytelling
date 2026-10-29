import { useEffect, useRef, useState } from "react";

export interface ElementSize {
  width: number;
  height: number;
}

const ZERO: ElementSize = { width: 0, height: 0 };

/**
 * Get the width and height of an element when it is resized.
 * The state is only updated when the size changes, to avoid re-renders.
 */
export function useResizeObserver(ref: React.RefObject<Element | null>) {
  const [size, setSize] = useState<ElementSize>(ZERO);
  const sizeRef = useRef<ElementSize>(ZERO);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;

      // use the size from the observer instead of measuring the element again
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
