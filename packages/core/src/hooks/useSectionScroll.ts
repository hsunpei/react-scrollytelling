import { useCallback } from 'react';

import {
  IntersectionObserverOptions,
  useIntersectionObserver,
} from './intersection/useIntersectionObserver';
import { useRafThrottle } from './performance/useRafThrottle';
import { clampScrolledRatio, getScrollPosition } from '../utils';

export interface SectionScrollInfo {
  isIntersecting: boolean;
  scrolledRatio: number;
  scrollBottom: number;
  distance: number;
}

export function getSectionScrollInfo(
  sectionRef: React.RefObject<Element>,
  isIntersecting: boolean
): SectionScrollInfo {
  // TODO: can possibly reduce the measurement by using resizeObserver
  const sectionRect = sectionRef.current?.getBoundingClientRect();
  if (!sectionRect) {
    return { scrolledRatio: 0, scrollBottom: 0, distance: Infinity, isIntersecting };
  }

  const { scrollTop, scrollBottom } = getScrollPosition();
  const sectionTop = sectionRect.top + scrollTop;

  const distance = scrollBottom - sectionTop;
  const ratio = clampScrolledRatio(distance / sectionRect.height);

  return { scrolledRatio: ratio, scrollBottom, distance, isIntersecting };
}

/**
 * When the section is visible in the viewport
 * his hook will pass the ratio of the section that is above the bottom of the viewport
 * through the `onScroll` callback.
 * @param sectionRef - The reference to the section element
 * @param shouldObserve - Whether the underlying IntersectionObserver should be active
 * @param onScroll - The callback to track the scroll ratio
 */
export function useSectionScroll(
  sectionRef: React.RefObject<Element>,
  onScroll: (scrollInfo: SectionScrollInfo) => void,
  shouldObserve = true,
  options?: IntersectionObserverOptions
) {
  const handleScroll = useCallback(
    (isIntersecting: boolean) => {
      const scrollInfo = getSectionScrollInfo(sectionRef, isIntersecting);
      onScroll(scrollInfo);
    },
    [sectionRef, onScroll]
  );
  const onPageScroll = useRafThrottle(handleScroll);

  const onObserve = useCallback(
    ({ isIntersecting }: IntersectionObserverEntry) => {
      onPageScroll(isIntersecting);

      // track scrolling only when the section is visible in viewport
      if (isIntersecting) {
        window.addEventListener('scroll', onPageScroll.bind(null, isIntersecting));
      } else {
        window.removeEventListener('scroll', onPageScroll.bind(null, isIntersecting));
      }
    },
    [onPageScroll]
  );

  useIntersectionObserver(sectionRef, options, shouldObserve, onObserve);
}
