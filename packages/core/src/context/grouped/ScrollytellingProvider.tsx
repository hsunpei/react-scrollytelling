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
  private observers: ActiveSectionObserver[];

  constructor() {
    this.observers = [];
  }

  subscribe(obs: ActiveSectionObserver) {
    this.observers.push(obs);
  }

  unsubscribe(obs: ActiveSectionObserver) {
    this.observers = this.observers.filter((observer) => observer !== obs);
  }

  notify(data: ActiveSectionScrollInfo) {
    this.observers.forEach((observer) => observer(data));
  }
}

const activeSectionObservable = new ActiveSectionObservable();

export const ScrollytellingProvider = ({ children }: PageProps) => {
  const { Provider } = ScrollytellingContext;

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
    []
  );
  const onActiveSectionUpdateThrottled = useRafThrottle(onActiveSectionUpdate);

  const onSectionScroll = useCallback(
    (trackingId: string, scrolledRatio: number, viewportBtmDistance: number) => {
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

  const context: ActiveSectionTracker = useMemo(
    () => ({
      onSectionScroll: onSectionScrollThrottled,
      activeSectionIdRef,
      activeSectionRatioRef,
      subscribe: activeSectionObservable.subscribe,
      unsubscribe: activeSectionObservable.unsubscribe,
    }),
    [onSectionScrollThrottled]
  );

  return <Provider value={context}>{children}</Provider>;
};
