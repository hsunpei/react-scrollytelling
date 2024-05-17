import { createContext } from 'react';

export type sectionID = string | null;

export interface ActiveSectionInfo {
  /** `trackingId` of the active section (section closest to the bottom of the viewport) */
  id: sectionID;

  /** Ratio of the active section being scrolled  */
  ratio: number | null;
}

export interface ActiveSectionTracker {
  /** For a tracked section to notify the provider that the section is being scrolled  */
  onSectionScroll: (trackingId: string, scrolledRatio: number, viewportBtmDistance: number) => void;

  // /**
  //  * When the active section (section closest to the bottom of the viewport) changes,
  //  * this callback will be invoked
  //  */
  // onActiveSectionChange: (activeSection: ActiveSectionInfo) => void;

  /** The `trackingId` of the active section */
  activeSectionIdRef: React.MutableRefObject<string | null>;

  /** The ratio of the active section */
  activeSectionRatioRef: React.MutableRefObject<number | null>;
}

export const ScrollytellingContext = createContext<ActiveSectionTracker | null>(null);
