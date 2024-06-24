'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { ActiveSectionObservable } from './ActiveSectionObservable';
import { ActiveSectionTracker, ScrollytellingContext } from './ScrollytellingContext';
import { TrackedSections } from './TrackedSections';
import { SectionScrollInfo, useIntersectionObserver } from '../../hooks';
import { useRafThrottle } from '../../hooks/performance/useRafThrottle';
import { getScrollPosition } from '../../utils';

export interface ScrollytellingProviderProps {
  children: React.ReactNode;
}

export const ScrollytellingProvider = ({ children }: ScrollytellingProviderProps) => {
  const { Provider } = ScrollytellingContext;

  /**
   * Ref to the outer wrapper which contains all the scrollytelling components.
   * It only listens to the scroll events when the wrapper is within the viewport.
   */
  const wrapperRef = useRef<HTMLDivElement>(null);

  const activeSectionObservableRef = useRef<ActiveSectionObservable | null>(null);
  // avoiding recreating the ref contents on every re-renders (instead of using initialValue)
  if (!activeSectionObservableRef.current) {
    activeSectionObservableRef.current = new ActiveSectionObservable();
  }
  const { current: activeSectionObservable } = activeSectionObservableRef;

  const trackedSectionsRef = useRef<TrackedSections | null>(null);
  // avoiding recreating the ref contents on every re-renders (instead of using initialValue)
  if (!trackedSectionsRef.current) {
    trackedSectionsRef.current = new TrackedSections();
  }

  const activeSectionIdRef = useRef<string | null>(null);
  const activeSectionRatioRef = useRef<number | null>(null);

  /** Record the distance to the bottom of the viewport */
  const activeSectionBtmDistRef = useRef<number>(Infinity);

  const onActiveSectionUpdate = useCallback(
    (trackingId: string, scrolledRatio: number, viewportBtmDistance: number) => {
      activeSectionIdRef.current = trackingId;
      activeSectionRatioRef.current = scrolledRatio;
      activeSectionBtmDistRef.current = viewportBtmDistance;

      activeSectionObservable.notify({ trackingId, scrolledRatio, viewportBtmDistance });
    },
    [activeSectionObservable]
  );
  const onActiveSectionUpdateThrottled = useRafThrottle(onActiveSectionUpdate);

  const handleScroll = useCallback(() => {
    const { scrollTop, windowHeight } = getScrollPosition();
    const activeSectionId = trackedSectionsRef.current!.findClosestToBottomId(
      scrollTop,
      windowHeight
    );
    console.log('handleScroll', activeSectionId);
  }, []);
  const handleScrollThrottled = useRafThrottle(handleScroll);

  const onObserve = useCallback(
    ({ isIntersecting }: IntersectionObserverEntry) => {
      // track scrolling only when the section is visible in viewport
      if (isIntersecting) {
        window.addEventListener('scroll', handleScrollThrottled);
      } else {
        window.removeEventListener('scroll', handleScrollThrottled);
      }
    },
    [handleScrollThrottled]
  );
  useIntersectionObserver(wrapperRef, undefined, undefined, onObserve);

  // TODO: remove the following
  const onSectionScroll = useCallback(
    (
      trackingId: string,
      { scrolledRatio, distance: viewportBtmDistance, isIntersecting }: SectionScrollInfo
    ) => {
      console.log('onSectionScroll', trackingId, scrolledRatio, viewportBtmDistance);
      const preActiveSectionBtmDist = activeSectionBtmDistRef.current;
      if (!isIntersecting) {
        if (activeSectionIdRef.current === trackingId) {
          activeSectionBtmDistRef.current = Infinity;
        }
      } else {
        // intersecting
        console.log('onActiveSectionUpdate', {
          trackingId,
          currentSecId: activeSectionIdRef.current,
          scrolledRatio,
          preActiveSectionBtmDist,
          viewportBtmDistance,
        });

        if (
          activeSectionIdRef.current === trackingId ||
          (viewportBtmDistance > 0 && viewportBtmDistance < preActiveSectionBtmDist) ||
          (viewportBtmDistance <= 0 &&
            preActiveSectionBtmDist < 0 &&
            viewportBtmDistance > preActiveSectionBtmDist)
        ) {
          console.log('onActiveSectionUpdate > updating', {
            trackingId,
            currentSecId: activeSectionIdRef.current,
            scrolledRatio,
            preActiveSectionBtmDist,
            viewportBtmDistance,
          });
          onActiveSectionUpdate(trackingId, scrolledRatio, viewportBtmDistance);
        }
      }
    },
    [onActiveSectionUpdate]
  );

  // TODO: reset the distance when the section is not in the viewport

  const context: ActiveSectionTracker = useMemo(
    () => ({
      onSectionScroll: onSectionScroll,
      activeSectionIdRef,
      activeSectionRatioRef,
      subscribe: activeSectionObservable.subscribe,
      unsubscribe: activeSectionObservable.unsubscribe,
      trackedSections: trackedSectionsRef.current!,
    }),
    [activeSectionObservable.subscribe, activeSectionObservable.unsubscribe, onSectionScroll]
  );

  return (
    <Provider value={context}>
      <div ref={wrapperRef}>{children}</div>
    </Provider>
  );
};
