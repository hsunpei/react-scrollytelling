import { useCallback } from 'react';

import { useScrollytelling } from '../grouped/useScrollytelling';
import {
  DEFAULT_INTERSECTION_OBS_OPTIONS,
  IntersectionObserverOptions,
  useIntersectionObserver,
} from '../useIntersectionObserver';
import { SectionScrollInfo } from '../useSectionScroll';

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
  onScroll?: (scrollInfo: SectionScrollInfo) => void | undefined,
  shouldObserve = true,
  options: IntersectionObserverOptions = DEFAULT_INTERSECTION_OBS_OPTIONS
) {
  const { trackedSections } = useScrollytelling();

  const onObserve = useCallback(
    ({ isIntersecting }: IntersectionObserverEntry) => {
      if (isIntersecting) {
        trackedSections.setSection(sectionID, {
          sectionTop: sectionRef.current?.getBoundingClientRect().top || 0,
          sectionBottom: sectionRef.current?.getBoundingClientRect().bottom || 0,
          onActiveScroll: onScroll,
        });

        console.log('useTrackedSectionScroll > onObserve > added', sectionID, {
          sectionTop: sectionRef.current?.getBoundingClientRect().top || 0,
          sectionBottom: sectionRef.current?.getBoundingClientRect().bottom || 0,
          onActiveScroll: onScroll,
        });
      } else {
        console.log('useTrackedSectionScroll > onObserve > removed', sectionID);
        trackedSections.removeSection(sectionID);
      }
    },
    [trackedSections, sectionID, sectionRef, onScroll]
  );

  // TODO - setSection when the section is resizing

  useIntersectionObserver(sectionRef, options, shouldObserve, onObserve);
}
