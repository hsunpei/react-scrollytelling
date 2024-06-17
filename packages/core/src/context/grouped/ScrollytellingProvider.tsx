'use client';

import React, { useRef, useCallback, useMemo } from 'react';

import {
  ActiveSectionObserver,
  ActiveSectionScrollInfo,
  ActiveSectionTracker,
  ScrollytellingContext,
} from './ScrollytellingContext';
import { SectionScrollInfo } from '../../hooks';
import { useRafThrottle } from '../../hooks/performance/useRafThrottle';

export interface PageProps {
  children: React.ReactNode;
}

class ActiveSectionObservable {
  private observers: Set<ActiveSectionObserver>;

  constructor() {
    this.observers = new Set();
  }

  subscribe = (obs: ActiveSectionObserver) => {
    this.observers.add(obs);
  };

  unsubscribe = (obs: ActiveSectionObserver) => {
    this.observers.delete(obs);
  };

  notify = (data: ActiveSectionScrollInfo) => {
    this.observers.forEach((observer) => observer(data));
  };
}

export const ScrollytellingProvider = ({ children }: PageProps) => {
  const { Provider } = ScrollytellingContext;

  const { current: activeSectionObservable } = useRef(new ActiveSectionObservable());

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
    }),
    [activeSectionObservable.subscribe, activeSectionObservable.unsubscribe, onSectionScroll]
  );

  return <Provider value={context}>{children}</Provider>;
};
