import { useCallback, useState, useRef } from 'react';

import { IntersectionObserverOptions, useIntersectionObserver } from './useIntersectionObserver';

/**
 * A function to help track the in viewport state of an element with track once option.
 * It is useful for building triggering animations or lazy loading images.
 */
export function useIntersectionReveal(
  sectionRef: React.RefObject<Element>,
  trackOnce = false,
  options: IntersectionObserverOptions
) {
  const preIntersecting = useRef(false);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  const onObserve = useCallback(
    (entry: IntersectionObserverEntry, disconnect: () => void) => {
      const curIntersecting = entry.isIntersecting;
      setIsIntersecting(curIntersecting);

      if (trackOnce && !preIntersecting.current && curIntersecting) {
        disconnect();
      }
    },
    [trackOnce]
  );

  useIntersectionObserver(sectionRef, options, true, onObserve);

  return { isIntersecting };
}
