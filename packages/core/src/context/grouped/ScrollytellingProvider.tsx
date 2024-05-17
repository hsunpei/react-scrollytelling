import React, { useRef, useCallback, useMemo } from 'react';

import { ActiveSectionTracker, ScrollytellingContext } from './ScrollyTellingContext';

export interface PageProps {
  children: React.ReactNode;
}

export const ScrollytellingProvider = ({ children }: PageProps) => {
  const { Provider } = ScrollytellingContext;

  const activeSectionIdRef = useRef<string | null>(null);
  const activeSectionRatioRef = useRef<number | null>(null);

  /** Record the distance to the bottom of the viewport */
  const activeSectionBtmDistRef = useRef<number>(Infinity);

  /** Help us throttle the callback by using rAF */
  const animationFrameScheduledRef = useRef<boolean>(false);

  const onActiveSectionUpdate = useCallback(
    (trackingId: string, scrolledRatio: number, viewportBtmDistance: number) => {
      // TODO: throttle this callback with rAF
      activeSectionIdRef.current = trackingId;
      activeSectionRatioRef.current = scrolledRatio;
      activeSectionBtmDistRef.current = viewportBtmDistance;
    },
    []
  );

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
        onActiveSectionUpdate(trackingId, scrolledRatio, viewportBtmDistance);
      }
    },
    [onActiveSectionUpdate]
  );

  const context: ActiveSectionTracker = useMemo(
    () => ({
      onSectionScroll,
      activeSectionIdRef,
      activeSectionRatioRef,
    }),
    [onSectionScroll]
  );

  // TODO: maybe use subscribe & notify pattern to update active section watcher

  return <Provider value={context}>{children}</Provider>;
};
