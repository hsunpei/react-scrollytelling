import { useCallback } from 'react';

import { useScrollytelling } from '../grouped/useScrollytelling';
import { IntersectionObserverOptions } from '../useIntersectionObserver';
import { SectionScrollInfo, useSectionScroll } from '../useSectionScroll';

/**
 * Notify ScrollytellingProvider to update the active section
 * when this section is scrolled into view.
 * @param sectionRef - The reference to the section element
 * @param sectionID - The tracking ID of the section
 * @param onScroll - The callback to track the scroll ratio
 * @param shouldObserve - Whether the underlying IntersectionObserver should be active
 * @param options - The options for the IntersectionObserver
 */
export function useTrackedSectionScroll(
  sectionRef: React.RefObject<Element>,
  sectionID: string,
  onScroll: (scrollInfo: SectionScrollInfo) => void,
  shouldObserve = true,
  options: IntersectionObserverOptions
) {
  const { onSectionScroll } = useScrollytelling();

  const handleScroll = useCallback(
    (scrollInfo: SectionScrollInfo) => {
      onSectionScroll(sectionID, scrollInfo.scrolledRatio, scrollInfo.distance);
      onScroll(scrollInfo);
    },
    [onSectionScroll, sectionID, onScroll]
  );

  const { isIntersecting } = useSectionScroll(sectionRef, handleScroll, options, shouldObserve);

  return { isIntersecting };
}
