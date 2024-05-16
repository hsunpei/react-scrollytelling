import React, { useRef, useCallback } from 'react';

import { ActiveSectionTracker, ScrollytellingContext } from './ScrollyTellingContext';

export interface PageProps {
  children: React.ReactNode;
}

export const ScrollytellingProvider = ({ children }: PageProps) => {
  const { Provider } = ScrollytellingContext;

  const activeSectionIdRef = useRef<string | null>(null);
  const activeSectionRatioRef = useRef<number | null>(null);

  const onSectionScroll = useCallback((trackingId: string, viewportBtmDistance: number) => {
    // TODO: Implement onSectionScroll
    if (activeSectionIdRef.current === trackingId) {
      activeSectionRatioRef.current = viewportBtmDistance;
    }
  }, []);

  const context: ActiveSectionTracker = {
    onSectionScroll,
    activeSectionIdRef,
    activeSectionRatioRef,
  };

  return <Provider value={context}>{children}</Provider>;
};
