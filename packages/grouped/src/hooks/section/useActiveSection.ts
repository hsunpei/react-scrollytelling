import { useEffect } from "react";

import { type ActiveSectionObserver } from "../../context/grouped/ScrollytellingContext";
import { useScrollytelling } from "../grouped/useScrollytelling";

/**
 * Watches for all tracked sections to find the section closet to the bottom of the viewport
 * through ScrollytellingProvider.
 * It invokes the onActiveSectionChange when the active section changes
 * @param onActiveSectionChange - The callback needs to be memoized
 */
export function useActiveSection(onActiveSectionChange: ActiveSectionObserver) {
  const { subscribe, unsubscribe, activeSectionIdRef, activeSectionRatioRef } =
    useScrollytelling();

  useEffect(() => {
    subscribe(onActiveSectionChange);

    if (activeSectionIdRef.current !== null) {
      onActiveSectionChange({
        trackingId: activeSectionIdRef.current,
        scrolledRatio: activeSectionRatioRef.current ?? 0,
        viewportBtmDistance: 0,
      });
    }

    return () => {
      unsubscribe(onActiveSectionChange);
    };
  }, [
    onActiveSectionChange,
    subscribe,
    unsubscribe,
    activeSectionIdRef,
    activeSectionRatioRef,
  ]);
}
