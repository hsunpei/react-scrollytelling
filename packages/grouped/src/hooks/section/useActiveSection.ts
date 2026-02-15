import { useEffect } from "react";

import { ActiveSectionObserver } from "../../context/grouped/ScrollytellingContext";
import { useScrollytelling } from "../grouped/useScrollytelling";

/**
 * Watches for all tracked sections to find the section closet to the bottom of the viewport
 * through ScrollytellingProvider.
 * It invokes the onActiveSectionChange when the active section changes
 * @param onActiveSectionChange - The callback needs to be memoized
 */
export function useActiveSection(onActiveSectionChange: ActiveSectionObserver) {
  const { subscribe, unsubscribe } = useScrollytelling();

  useEffect(() => {
    subscribe(onActiveSectionChange);
    return () => {
      unsubscribe(onActiveSectionChange);
    };
  }, [onActiveSectionChange, subscribe, unsubscribe]);
}
