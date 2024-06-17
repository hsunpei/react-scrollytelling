import { useCallback } from 'react';

import { useScrollytelling } from '../grouped/useScrollytelling';
import {
  DEFAULT_INTERSECTION_OBS_OPTIONS,
  IntersectionObserverOptions,
} from '../useIntersectionObserver';
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
  onScroll: (scrollInfo: SectionScrollInfo) => void = () => {
    return void 0;
  },
  shouldObserve = true,
  options: IntersectionObserverOptions = DEFAULT_INTERSECTION_OBS_OPTIONS
) {
  const { onSectionScroll } = useScrollytelling();

  const handleScroll = useCallback(
    (scrollInfo: SectionScrollInfo) => {
      console.log('useTrackedSectionScroll', sectionID, scrollInfo);
      onSectionScroll(sectionID, scrollInfo);
      onScroll(scrollInfo);
    },
    [onSectionScroll, sectionID, onScroll]
  );

  useSectionScroll(sectionRef, handleScroll, shouldObserve, options);
}
