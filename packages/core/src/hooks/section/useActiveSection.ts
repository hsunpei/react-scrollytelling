import { useEffect } from 'react';

import { ActiveSectionObserver } from '../../context/grouped/ScrollytellingContext';
import { useScrollytelling } from '../grouped/useScrollytelling';

/**
 * Invokes the callback when the active section changes
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
