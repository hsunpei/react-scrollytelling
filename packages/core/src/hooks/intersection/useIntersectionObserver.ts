import { useCallback, useEffect, useRef, useState } from "react";

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
 */
export function useIntersectionObserver(
  sectionRef: React.RefObject<Element | null>,
  options: IntersectionObserverOptions = DEFAULT_INTERSECTION_OBS_OPTIONS,
  shouldObserve = true,
  onObserve?: (entry: IntersectionObserverEntry, disconnect: () => void) => void
) {
  // TODO: remove the state and use a callback instead
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

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
        setIsIntersecting(entry.isIntersecting);
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

  return { isIntersecting, disconnect };
}
