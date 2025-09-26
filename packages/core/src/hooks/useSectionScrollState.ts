import { useCallback, useState } from 'react';

import { IntersectionObserverOptions } from './intersection/useIntersectionObserver';
import { SectionScrollInfo, useSectionScroll } from './useSectionScroll';

/**
 * Get the state of the section scroll
 * @param sectionRef - The reference to the section element
 * @param shouldObserve - Whether the underlying IntersectionObserver should be active
 * @param options - The options to pass to the IntersectionObserver
 */
export function useSectionScrollState(
  sectionRef: React.RefObject<Element | null>,
  shouldObserve = true,
  options?: IntersectionObserverOptions
) {
  const [scrolledRatio, setScrolledRatio] = useState<number>(0);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  const onScroll = useCallback(
    ({ scrolledRatio: ratio, isIntersecting: intersecting }: SectionScrollInfo) => {
      setScrolledRatio(ratio);
      setIsIntersecting(intersecting);
    },
    []
  );

  useSectionScroll(sectionRef, onScroll, shouldObserve, options);

  return { scrolledRatio, isIntersecting };
}
