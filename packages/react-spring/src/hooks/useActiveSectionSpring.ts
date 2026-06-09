import { useCallback, useState } from "react";

import {
  type ActiveSectionScrollInfo,
  useActiveSection,
  type ActiveSectionObserver,
} from "@react-scrollytelling/grouped";
import { SpringValue } from "@react-spring/web";

/**
 * Watches for all tracked sections to find the section closet to the bottom of the viewport
 * through ScrollytellingProvider.
 * It invokes the onActiveSectionChange when the active section changes.
 * Returns the Spring value (react-spring) of the section scroll.
 * @param onActiveSectionChange - The callback needs to be memoized
 * @returns The trackingId of the active section and the Spring value of the section scroll
 */
export function useActiveSectionSpring(
  onActiveSectionChange?: ActiveSectionObserver
) {
  // Use state to return a stable SpringValue object
  const [scrolledRatioSpring] = useState(() => new SpringValue(0));
  const [trackingIdSpring] = useState(() => new SpringValue<string | null>(null));
  const [viewportBtmDistanceSpring] = useState(() => new SpringValue(0));
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const onSectionScroll = useCallback(
    (scrollInfo: ActiveSectionScrollInfo) => {
      const { trackingId: id, scrolledRatio, viewportBtmDistance } = scrollInfo;
      setTrackingId((prev) => (prev === id ? prev : id));
      
      trackingIdSpring.set(id);
      scrolledRatioSpring.set(scrolledRatio);
      viewportBtmDistanceSpring.set(viewportBtmDistance);

      if (onActiveSectionChange) {
        onActiveSectionChange(scrollInfo);
      }
    },
    [onActiveSectionChange, scrolledRatioSpring, trackingIdSpring, viewportBtmDistanceSpring]
  );

  useActiveSection(onSectionScroll);

  return { trackingId, trackingIdSpring, scrolledRatioSpring, viewportBtmDistanceSpring };
}
