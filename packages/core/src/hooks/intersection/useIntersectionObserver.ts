import { useCallback, useEffect, useRef } from "react";

export interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

// extracted the default options to avoid re-rendering
export const DEFAULT_INTERSECTION_OBS_OPTIONS: IntersectionObserverOptions = {};

/**
 * A hook which uses the IntersectionObserver API
 * to detect when the section is visible in the viewport.
 * It does NOT maintain any React state internally — consumers that need
 * `isIntersecting` as state should use `useIntersectionObserverState` instead.
 */
export function useIntersectionObserver(
  sectionRef: React.RefObject<Element | null>,
  options: IntersectionObserverOptions = DEFAULT_INTERSECTION_OBS_OPTIONS,
  shouldObserve = true,
  onObserve?: (entry: IntersectionObserverEntry, disconnect: () => void) => void
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, []);

  // use IntersectionObserver to detect when the section is visible in the viewport
  useEffect(() => {
    if (window && IntersectionObserver && shouldObserve) {
      observerRef.current = new IntersectionObserver(([entry]) => {
        if (onObserve) {
          onObserve(entry, disconnect);
        }
      }, options);

      const sectionElement = sectionRef.current;

      if (sectionElement) {
        observerRef.current.observe(sectionElement);
      }

      return () => {
        if (observerRef.current && sectionElement) {
          observerRef.current.unobserve(sectionElement);
        }
      };
    }
  }, [sectionRef, options, shouldObserve, onObserve, disconnect]);

  return { disconnect };
}
