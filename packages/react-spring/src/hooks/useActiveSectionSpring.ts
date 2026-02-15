import { useCallback, useState } from "react";

import {
  ActiveSectionScrollInfo,
  useActiveSection,
  ActiveSectionObserver,
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
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const onSectionScroll = useCallback(
    (scrollInfo: ActiveSectionScrollInfo) => {
      const { trackingId: id, scrolledRatio } = scrollInfo;
      setTrackingId(id);
      scrolledRatioSpring.set(scrolledRatio);

      if (onActiveSectionChange) {
        onActiveSectionChange(scrollInfo);
      }
    },
    [onActiveSectionChange, scrolledRatioSpring]
  );

  useActiveSection(onSectionScroll);

  return { trackingId, scrolledRatioSpring };
}
