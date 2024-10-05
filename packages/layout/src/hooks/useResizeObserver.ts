import { useEffect, useRef, useState } from 'react';

export function useResizeObserver(ref: React.RefObject<Element>) {
  const resizeObserver = useRef<ResizeObserver | null>(null);

  const [sizes, setSizes] = useState<DOMRectReadOnly>({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => null,
  });

  useEffect(() => {
    if (!resizeObserver.current) {
      resizeObserver.current = new ResizeObserver((entries) => {
        const [entry] = entries;
        setSizes(entry.contentRect);
      });
    }

    const { current: observer } = resizeObserver;

    if (ref.current) {
      observer?.observe(ref.current);
    }

    return () => {
      observer?.disconnect();
    };
  }, [ref]);

  return sizes;
}
