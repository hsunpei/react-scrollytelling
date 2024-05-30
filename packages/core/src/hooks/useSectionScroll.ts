import { useEffect, useCallback } from 'react';

import { useRafThrottle } from './performance/useRafThrottle';
import { IntersectionObserverOptions, useIntersectionObserver } from './useIntersectionObserver';
import { clampScrolledRatio, getScrollPosition } from '../utils';

export interface SectionScrollInfo {
  scrolledRatio: number;
  scrollBottom: number;
  distance: number;
}

export function getSectionScrollInfo(sectionRef: React.RefObject<Element>): SectionScrollInfo {
  // TODO: can possibly reduce the measurement by using resizeObserver
  const sectionRect = sectionRef.current?.getBoundingClientRect();
  if (!sectionRect) {
    return { scrolledRatio: 0, scrollBottom: 0, distance: Infinity };
  }

  const { scrollTop, scrollBottom } = getScrollPosition();
  const sectionTop = sectionRect.top + scrollTop;

  const distance = scrollBottom - sectionTop;
  const ratio = clampScrolledRatio(distance / sectionRect.height);

  return { scrolledRatio: ratio, scrollBottom, distance };
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
  options: IntersectionObserverOptions
) {
  const { isIntersecting } = useIntersectionObserver(sectionRef, options, shouldObserve);

  const handleScroll = useCallback(() => {
    const scrollInfo = getSectionScrollInfo(sectionRef);
    onScroll(scrollInfo);
  }, [sectionRef, onScroll]);
  const onPageScroll = useRafThrottle(handleScroll);

  // track scrolling only when the section is visible in viewport
  useEffect(() => {
    if (window && isIntersecting) {
      window.addEventListener('scroll', onPageScroll);
      return () => {
        window.removeEventListener('scroll', onPageScroll);
      };
    }
  }, [onPageScroll, isIntersecting]);

  // initialize the scroll info when the section is mounted
  useEffect(() => {
    if (window) {
      handleScroll();
    }
  }, [handleScroll]);

  return { isIntersecting };
}
