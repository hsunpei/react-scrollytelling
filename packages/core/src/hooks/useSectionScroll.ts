import { useMemo } from 'react';

import { useIntersectionObserver } from './useIntersectionObserver';

/**
 * Returns the current window `scrollTop`, `windowHeight` (height of the window),
 * and the `scrollBottom` (`scrollTop` + `windowHeight`)
 */
export function getScrollPosition() {
  // detect window object to prevent issues in SSR
  if (typeof window === 'undefined') {
    return {
      scrollTop: 0,
      scrollBottom: 0,
      windowHeight: 10,
    };
  }

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.outerHeight || document.documentElement.clientHeight;
  const scrollBottom = scrollTop + windowHeight;

  return {
    scrollTop,
    scrollBottom,
    windowHeight,
  };
}

export function getCappedScrolledRatio(ratio: number) {
  if (ratio < 0) {
    return 0;
  }
  if (ratio > 1) {
    return 1;
  }
  return ratio;
}

/**
 * When the section is visible in the viewport
 * his hook will pass the ratio of the section that is above the bottom of the viewport
 * through the `onScroll` callback.
 * @param sectionRef - The reference to the section element
 * @param steps - The number of steps to divide the section into. It will have an impact on the granularity of the tracked scroll ratio.
 * @param shouldObserve - Whether the underlying IntersectionObserver should be active
 * @param onScroll - The callback to track the scroll ratio
 */
export function useSectionScroll(
  sectionRef: React.RefObject<Element>,
  steps = 100,
  shouldObserve = true,
  onScroll: (ratio: number) => void
) {
  const threshold = useMemo(() => Array.from({ length: steps + 1 }, (_, i) => i / steps), [steps]);

  const { isIntersecting, disconnect } = useIntersectionObserver(
    sectionRef,
    { threshold },
    shouldObserve,
    (entry) => {
      if (entry.isIntersecting) {
        // we cannot use the entry.intersectionRatio directly
        // because it is the ratio of the section that is visible in the viewport
        // and we need the ratio of the section that is above the bottom of the viewport
        const sectionRect = entry.boundingClientRect;

        const { scrollTop, scrollBottom } = getScrollPosition();
        const sectionTop = sectionRect.top + scrollTop;

        const distance = scrollBottom - sectionTop;
        const ratio = getCappedScrolledRatio(distance / sectionRect.height);
        console.log('Section is at', {
          sectionRect,
          sectionTop,
          scrollBottom,
          distance,
          height: sectionRect.height,
          ratio,
        });

        onScroll(ratio);
      }
    }
  );

  return { isIntersecting, disconnect };
}
