import { useCallback } from "react";

import {
  IntersectionObserverOptions,
  SectionScrollInfo,
  useSectionScroll,
} from "@react-scrollytelling/core";
import { useMotionValue } from "motion/react";

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
  const scrolledRatioMotionValue = useMotionValue(0);

  const onSectionScroll = useCallback(
    (scrollInfo: SectionScrollInfo) => {
      const { scrolledRatio } = scrollInfo;
      scrolledRatioMotionValue.set(scrolledRatio);

      if (onScroll) {
        onScroll(scrollInfo);
      }
    },
    [onScroll, scrolledRatioMotionValue]
  );

  useSectionScroll(sectionRef, onSectionScroll, shouldObserve, options);

  return { scrolledRatioMotionValue };
}
