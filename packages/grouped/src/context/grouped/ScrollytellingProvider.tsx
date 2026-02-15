"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useIntersectionObserver } from "@react-scrollytelling/core";
import { useRafThrottle } from "@react-scrollytelling/core";
import {
  clampScrolledRatio,
  getScrollPosition,
} from "@react-scrollytelling/core";

import { ActiveSectionObservable } from "./ActiveSectionObservable";
import {
  ActiveSectionTracker,
  ScrollytellingContext,
} from "./ScrollytellingContext";
import { TrackedSections } from "./TrackedSections";

export interface ScrollytellingProviderProps {
  children: React.ReactNode;
}

export const ScrollytellingProvider = ({
  children,
}: ScrollytellingProviderProps) => {
  const { Provider } = ScrollytellingContext;

  /**
   * Ref to the outer wrapper which contains all the scrollytelling components.
   * It only listens to the scroll events when the wrapper is within the viewport.
   */
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [activeSectionObservable] = useState(() => new ActiveSectionObservable());

  /**
   * Ref to the tracked sections in the viewport, initialize later to track mounted active sections
   * (scroll events are not triggered yet for these sections).
   */
  // const trackedSectionsRef = useRef<TrackedSections | null>(null);
  const [trackedSections] = useState(() => new TrackedSections());

  const activeSectionIdRef = useRef<string | null>(null);
  const activeSectionRatioRef = useRef<number | null>(null);

  /** Record the distance to the bottom of the viewport */
  const activeSectionBtmDistRef = useRef<number>(Infinity);

  const onActiveSectionUpdate = useCallback(
    (
      trackingId: string,
      scrolledRatio: number,
      viewportBtmDistance: number
    ) => {
      activeSectionIdRef.current = trackingId;
      activeSectionRatioRef.current = scrolledRatio;
      activeSectionBtmDistRef.current = viewportBtmDistance;

      activeSectionObservable.notify({
        trackingId,
        scrolledRatio,
        viewportBtmDistance,
      });
    },
    [activeSectionObservable]
  );
  const onActiveSectionUpdateThrottled = useRafThrottle(onActiveSectionUpdate);

  const handleScroll = useCallback(() => {
    const { scrollTop, windowHeight } = getScrollPosition();

    const activeSectionId = trackedSections.findClosestToBottomId(
      scrollTop,
      windowHeight
    );

    const activeSection = trackedSections.getSection(activeSectionId || "");

    // notify the active section about its scroll progress
    if (activeSection) {
      const { sectionTop, sectionBottom } = activeSection;
      const scrollBottom = scrollTop + windowHeight;
      const distance = scrollBottom - sectionTop;
      const sectionHeight = sectionBottom - sectionTop;

      const ratio = clampScrolledRatio(distance / sectionHeight);

      if (activeSection.onActiveScroll) {
        // notify the active section
        activeSection.onActiveScroll({
          isIntersecting: true,
          scrolledRatio: ratio,
          scrollBottom,
          distance,
        });
      }

      // notify the sections tracking the active section
      onActiveSectionUpdateThrottled(activeSectionId!, ratio, distance);
    }
  }, [onActiveSectionUpdateThrottled, trackedSections]);
  const handleScrollThrottled = useRafThrottle(handleScroll);

  // Update the onNewSectionAdded callback when handleScrollThrottled changes.
  useEffect(() => {
    trackedSections.updateOnNewSectionAdded(handleScrollThrottled);
  }, [trackedSections, handleScrollThrottled]);

  const onObserve = useCallback(
    ({ isIntersecting }: IntersectionObserverEntry) => {
      // track scrolling only when the section is visible in viewport
      if (isIntersecting) {
        window.addEventListener("scroll", handleScrollThrottled);
      } else {
        window.removeEventListener("scroll", handleScrollThrottled);
      }
    },
    [handleScrollThrottled]
  );
  useIntersectionObserver(wrapperRef, undefined, true, onObserve);

  // TODO: reset the distance when the section is not in the viewport

  const context: ActiveSectionTracker = useMemo(
    () => ({
      activeSectionIdRef,
      activeSectionRatioRef,
      subscribe: activeSectionObservable.subscribe,
      unsubscribe: activeSectionObservable.unsubscribe,
      trackedSections: trackedSections,
    }),
    [
      activeSectionObservable.subscribe,
      activeSectionObservable.unsubscribe,
      trackedSections,
    ]
  );

  useEffect(() => {
    // prevent listening to scroll events when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScrollThrottled);
    };
  }, [handleScrollThrottled]);

  return (
    <Provider value={context}>
      <div ref={wrapperRef}>{children}</div>
    </Provider>
  );
};
