import { useCallback, useState } from 'react';

import { IntersectionObserverOptions } from './useIntersectionObserver';
import { SectionScrollInfo, useSectionScroll } from './useSectionScroll';

/**
 * Get the state of the section scroll
 * @param sectionRef - The reference to the section element
 * @param shouldObserve - Whether the underlying IntersectionObserver should be active
 * @param onScroll - The callback to track the scroll ratio
 */
export function useSectionScrollState(
  sectionRef: React.RefObject<Element>,
  shouldObserve = true,
  options: IntersectionObserverOptions
) {
  const [scrolledRatio, setScrolledRatio] = useState<number>(0);

  const onScroll = useCallback(({ scrolledRatio: ratio }: SectionScrollInfo) => {
    setScrolledRatio(ratio);
  }, []);

  const { isIntersecting } = useSectionScroll(sectionRef, onScroll, shouldObserve, options);

  return { scrolledRatio, isIntersecting };
}
