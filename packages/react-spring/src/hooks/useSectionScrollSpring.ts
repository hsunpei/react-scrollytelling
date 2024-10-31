import { useCallback, useRef } from 'react';

import {
  IntersectionObserverOptions,
  SectionScrollInfo,
  useSectionScroll,
} from '@react-scrollytelling/core';
import { SpringValue } from '@react-spring/web';

/**
 * Get the state of the section scroll
 * @param sectionRef - The reference to the section element
 * @param shouldObserve - Whether the underlying IntersectionObserver should be active
 * @param onScroll - The callback to track the scroll ratio
 */
export function useSectionScrollSpring(
  sectionRef: React.RefObject<Element>,
  onScroll?: (scrollInfo: SectionScrollInfo) => void,
  shouldObserve = true,
  options?: IntersectionObserverOptions
) {
  const scrolledRatioSpringRef = useRef(new SpringValue(0));

  const onSectionScroll = useCallback(
    (scrollInfo: SectionScrollInfo) => {
      const { scrolledRatio } = scrollInfo;
      console.log('onSectionScroll', scrolledRatio);
      scrolledRatioSpringRef.current.set(scrolledRatio);

      if (onScroll) {
        onScroll(scrollInfo);
      }
    },
    [onScroll]
  );

  useSectionScroll(sectionRef, onSectionScroll, shouldObserve, options);

  return { scrolledRatioSpring: scrolledRatioSpringRef.current };
}
