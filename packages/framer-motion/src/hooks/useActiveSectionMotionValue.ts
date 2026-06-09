import { useCallback, useState } from "react";

import {
  type ActiveSectionScrollInfo,
  useActiveSection,
  type ActiveSectionObserver,
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
  const trackingIdMotionValue = useMotionValue<string | null>(null);
  const viewportBtmDistanceMotionValue = useMotionValue(0);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const onSectionScroll = useCallback(
    (scrollInfo: ActiveSectionScrollInfo) => {
      const { trackingId: id, scrolledRatio, viewportBtmDistance } = scrollInfo;
      setTrackingId((prev) => (prev === id ? prev : id));
      
      trackingIdMotionValue.set(id);
      scrolledRatioMotionValue.set(scrolledRatio);
      viewportBtmDistanceMotionValue.set(viewportBtmDistance);

      if (onActiveSectionChange) {
        onActiveSectionChange(scrollInfo);
      }
    },
    [onActiveSectionChange, scrolledRatioMotionValue, trackingIdMotionValue, viewportBtmDistanceMotionValue]
  );

  useActiveSection(onSectionScroll);

  return {
    trackingId,
    trackingIdMotionValue,
    scrolledRatioMotionValue,
    viewportBtmDistanceMotionValue,
  };
}
