import { createContext } from 'react';

export type sectionID = string | null;

export interface ActiveSectionScrollInfo {
  /** `trackingId` of the active section (section closest to the bottom of the viewport) */
  trackingId: string;

  /** Ratio of the active section being scrolled  */
  scrolledRatio: number;

  /** Distance to the bottom of the viewport */
  viewportBtmDistance: number;
}

export type ActiveSectionObserver = (info: ActiveSectionScrollInfo) => void;

export interface ActiveSectionTracker {
  /** For a tracked section to notify the provider that the section is being scrolled  */
  onSectionScroll: (trackingId: string, scrolledRatio: number, viewportBtmDistance: number) => void;

  /** The `trackingId` of the active section */
  activeSectionIdRef: React.MutableRefObject<string | null>;

  /** The ratio of the active section */
  activeSectionRatioRef: React.MutableRefObject<number | null>;

  /** For useActiveSection to subscribe */
  subscribe: (obs: ActiveSectionObserver) => void;

  /** For useActiveSection to unsubscribe */
  unsubscribe: (obs: ActiveSectionObserver) => void;
}

export const ScrollytellingContext = createContext<ActiveSectionTracker | null>(null);
