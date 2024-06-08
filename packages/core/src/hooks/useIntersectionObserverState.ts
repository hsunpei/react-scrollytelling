import { useState } from 'react';

import { IntersectionObserverOptions, useIntersectionObserver } from './useIntersectionObserver';

export function useIntersectionObserverState(
  sectionRef: React.RefObject<Element>,
  options: IntersectionObserverOptions,
  shouldObserve: boolean
) {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  const { disconnect } = useIntersectionObserver(sectionRef, options, shouldObserve, (entry) => {
    setIsIntersecting(entry.isIntersecting);
  });

  return { isIntersecting, disconnect };
}
