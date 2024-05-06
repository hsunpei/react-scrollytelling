import { useCallback, useEffect, useRef, useState } from 'react';

export interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

// extracted the default options to avoid re-rendering
const DEFAULT_OPTIONS: IntersectionObserverOptions = {};

/**
 * A hook which uses the IntersectionObserver API
 * to detect when the section is visible in the viewport.
 */
export const useIntersectionObserver = (
  sectionRef: React.RefObject<Element>,
  options: IntersectionObserverOptions = DEFAULT_OPTIONS,
  shouldObserve = true
) => {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  const observerRef = useRef<IntersectionObserver | null>(null);

  // use IntersectionObserver to detect when the section is visible in the viewport
  useEffect(() => {
    if (window && IntersectionObserver && shouldObserve) {
      observerRef.current = new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      }, options);

      if (sectionRef.current) {
        observerRef.current.observe(sectionRef.current);
      }

      return () => {
        if (observerRef.current && sectionRef.current) {
          observerRef.current.unobserve(sectionRef.current);
        }
      };
    }
  }, [sectionRef, options, shouldObserve]);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, []);

  return { isIntersecting, disconnect };
};
