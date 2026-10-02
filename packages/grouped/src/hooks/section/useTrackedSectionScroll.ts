import { useCallback, useEffect, useRef } from "react";

import {
  DEFAULT_INTERSECTION_OBS_OPTIONS,
  type IntersectionObserverOptions,
  useIntersectionObserver,
  type SectionScrollInfo,
  getScrollPosition,
} from "@react-scrollytelling/core";

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

  /**
   * Record where the section sits in the document, as of right now.
   *
   * The offsets are absolute, so anything that moves or resizes the section
   * invalidates them — and the scroll ratio is computed from them against a
   * live `window.innerHeight`. Measure at the wrong moment and the two
   * disagree.
   */
  const measure = useCallback(() => {
    const element = sectionRef.current;
    if (!element) return;

    const { scrollTop } = getScrollPosition();
    const rect = element.getBoundingClientRect();

    trackedSections.setSection(sectionID, {
      sectionTop: rect.top + scrollTop,
      sectionBottom: rect.bottom + scrollTop,
      onActiveScroll: onScroll,
    });
  }, [onScroll, sectionID, sectionRef, trackedSections]);

  // Register the section in trackedSections on mount to allow initial closest section detection
  useEffect(() => {
    measure();

    return () => {
      trackedSections.unregisterSection(sectionID);
    };
  }, [measure, sectionID, trackedSections]);

  /**
   * Re-measure whenever the section moves under us.
   *
   * A mobile browser hiding its address bar — or an in-app browser collapsing
   * its own toolbars — changes the viewport height mid-scroll. Sections sized
   * in viewport units grow, every offset below them shifts, and
   * `window.innerHeight` changes in the same frame. Measured once at mount,
   * the cached offsets are then wrong by the height of the toolbar, and the
   * ratio jumps by that fraction of a section. `visualViewport` is the signal
   * that actually fires for in-app browser chrome; `resize` alone can miss it.
   */
  useEffect(() => {
    const element = sectionRef.current;
    if (!element || typeof window === "undefined") return;

    const remeasure = () => measure();

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(remeasure);
    observer?.observe(element);

    window.addEventListener("resize", remeasure);
    window.visualViewport?.addEventListener("resize", remeasure);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", remeasure);
      window.visualViewport?.removeEventListener("resize", remeasure);
    };
  }, [measure, sectionRef]);

  const onObserve = useCallback(
    ({ isIntersecting }: IntersectionObserverEntry) => {
      if (isIntersecting) {
        measure();
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
        trackedSections.untrackSection(sectionID);
      }
    },
    [measure, onScroll, sectionID, trackedSections]
  );

  useIntersectionObserver(sectionRef, options, shouldObserve, onObserve);
}
