import { useCallback, useState } from 'react';

import { IntersectionObserverOptions, useIntersectionObserver } from './useIntersectionObserver';

export function useIntersectionObserverState(
  sectionRef: React.RefObject<Element>,
  options?: IntersectionObserverOptions,
  shouldObserve?: boolean
) {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  const onObserve = useCallback((entry: IntersectionObserverEntry) => {
    setIsIntersecting(entry.isIntersecting);
  }, []);

  const { disconnect } = useIntersectionObserver(sectionRef, options, shouldObserve, onObserve);

  return { isIntersecting, disconnect };
}
