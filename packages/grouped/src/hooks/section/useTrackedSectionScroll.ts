import { useCallback, useEffect, useRef } from "react";

import {
  DEFAULT_INTERSECTION_OBS_OPTIONS,
  IntersectionObserverOptions,
  useIntersectionObserver,
} from "@react-scrollytelling/core/src/hooks/intersection/useIntersectionObserver";
import { SectionScrollInfo } from "@react-scrollytelling/core/src/hooks/useSectionScroll";
import { getScrollPosition } from "@react-scrollytelling/core/src/utils";

import { useScrollytelling } from "../grouped/useScrollytelling";

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

  /** Track the scroll progress if onScroll is provided */
  const scrollInfoRef = useRef<SectionScrollInfo | null>(null);

  // subscribe to the scroll progress,
  // it will be triggered when the section becomes the active section on screen
  useEffect(() => {
    const handleScroll = (info: SectionScrollInfo) => {
      scrollInfoRef.current = info;
      if (onScroll) {
        onScroll(info);
      }
    };

    trackedSections.subscribeScroll(sectionID, handleScroll);
  }, [onScroll, sectionID, trackedSections]);

  const onObserve = useCallback(
    ({ isIntersecting }: IntersectionObserverEntry) => {
      if (isIntersecting) {
        const { scrollTop } = getScrollPosition();

        trackedSections.setSection(sectionID, {
          sectionTop:
            (sectionRef.current?.getBoundingClientRect().top || 0) + scrollTop,
          sectionBottom:
            (sectionRef.current?.getBoundingClientRect().bottom || 0) +
            scrollTop,
          onActiveScroll: onScroll,
        });
      } else {
        // notify the scroll progress that isIntersecting = false
        const {
          scrolledRatio = 0,
          scrollBottom = 0,
          distance = 0,
        } = scrollInfoRef.current || {};

        if (onScroll) {
          onScroll({
            scrolledRatio,
            scrollBottom,
            distance,
            isIntersecting: false,
          });
        }
        trackedSections.removeSection(sectionID);
      }
    },
    [trackedSections, sectionID, sectionRef, onScroll]
  );

  // TODO - setSection when the section is resizing

  useIntersectionObserver(sectionRef, options, shouldObserve, onObserve);
}
