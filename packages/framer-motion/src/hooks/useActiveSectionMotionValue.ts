import { useCallback, useState } from "react";

import {
  ActiveSectionScrollInfo,
  useActiveSection,
  ActiveSectionObserver,
} from "@react-scrollytelling/grouped";
import { useMotionValue } from "motion/react";

/**
 * Watches for all tracked sections to find the section closet to the bottom of the viewport
 * through ScrollytellingProvider.
 * It invokes the onActiveSectionChange when the active section changes.
 * Returns the Motion value of the section scroll.
 * @param onActiveSectionChange - The callback needs to be memoized
 * @returns The trackingId of the active section and the Motion value of the section scroll
 */
export function useActiveSectionMotionValue(
  onActiveSectionChange?: ActiveSectionObserver
) {
  const scrolledRatioMotionValue = useMotionValue(0);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const onSectionScroll = useCallback(
    (scrollInfo: ActiveSectionScrollInfo) => {
      const { trackingId: id, scrolledRatio } = scrollInfo;
      setTrackingId(id);
      scrolledRatioMotionValue.set(scrolledRatio);

      if (onActiveSectionChange) {
        onActiveSectionChange(scrollInfo);
      }
    },
    [onActiveSectionChange, scrolledRatioMotionValue]
  );

  useActiveSection(onSectionScroll);

  return {
    trackingId,
    scrolledRatioMotionValue,
  };
}
