import { useCallback, useRef } from 'react';

import {
  IntersectionObserverOptions,
  SectionScrollInfo,
  useSectionScroll,
} from '@react-scrollytelling/core';
import { useMotionValue, MotionValue } from 'motion/react';

/**
 * Get the Motion value of the section scroll
 * @param sectionRef - The reference to the section element
 * @param shouldObserve - Whether the underlying IntersectionObserver should be active
 * @param onScroll - The callback to track the scroll ratio
 */
export function useSectionScrollMotionValue(
  sectionRef: React.RefObject<Element>,
  onScroll?: (scrollInfo: SectionScrollInfo) => void,
  shouldObserve = true,
  options?: IntersectionObserverOptions
) {
  const scrolledRatioMotionValueRef = useRef<MotionValue<number>>(useMotionValue(0));

  const onSectionScroll = useCallback(
    (scrollInfo: SectionScrollInfo) => {
      const { scrolledRatio } = scrollInfo;
      scrolledRatioMotionValueRef.current.set(scrolledRatio);

      if (onScroll) {
        onScroll(scrollInfo);
      }
    },
    [onScroll]
  );

  useSectionScroll(sectionRef, onSectionScroll, shouldObserve, options);

  return { scrolledRatioMotionValue: scrolledRatioMotionValueRef.current };
}
