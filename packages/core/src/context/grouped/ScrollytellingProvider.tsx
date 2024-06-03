'use client';

import React, { useRef, useCallback, useMemo } from 'react';

import {
  ActiveSectionObserver,
  ActiveSectionScrollInfo,
  ActiveSectionTracker,
  ScrollytellingContext,
} from './ScrollytellingContext';
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
    (trackingId: string, scrolledRatio: number, viewportBtmDistance: number) => {
      console.log('onSectionScroll', trackingId, scrolledRatio, viewportBtmDistance);
      const preActiveSectionBtmDist = activeSectionBtmDistRef.current;
      if (
        activeSectionIdRef.current === trackingId ||
        (viewportBtmDistance > 0 && viewportBtmDistance < preActiveSectionBtmDist) ||
        (viewportBtmDistance <= 0 &&
          preActiveSectionBtmDist < 0 &&
          viewportBtmDistance > preActiveSectionBtmDist)
      ) {
        onActiveSectionUpdateThrottled(trackingId, scrolledRatio, viewportBtmDistance);
      }
    },
    [onActiveSectionUpdateThrottled]
  );
  const onSectionScrollThrottled = useRafThrottle(onSectionScroll);

  // TODO: reset the distance when the section is not in the viewport

  const context: ActiveSectionTracker = useMemo(
    () => ({
      onSectionScroll: onSectionScrollThrottled,
      activeSectionIdRef,
      activeSectionRatioRef,
      subscribe: activeSectionObservable.subscribe,
      unsubscribe: activeSectionObservable.unsubscribe,
    }),
    [
      activeSectionObservable.subscribe,
      activeSectionObservable.unsubscribe,
      onSectionScrollThrottled,
    ]
  );

  return <Provider value={context}>{children}</Provider>;
};
