import { useCallback, useEffect, useRef } from "react";

import { clampScrolledRatio, getScrollPosition } from "../utils";
import {
  type IntersectionObserverOptions,
  useIntersectionObserver,
} from "./intersection/useIntersectionObserver";
import { useRafThrottle } from "./performance/useRafThrottle";

export interface SectionScrollInfo {
  /** Whether the section is intersecting with the viewport */
  isIntersecting: boolean;

  /** The ratio of the section that is above the bottom of the viewport */
  scrolledRatio: number;

  /** The distance from the top of the page to the page position of the bottom of the viewport */
  scrollBottom: number;

  /** The distance from the top of the section to the bottom of the viewport */
  distance: number;
}

export function getSectionScrollInfo(
  sectionRef: React.RefObject<Element | null>,
  isIntersecting: boolean
): SectionScrollInfo {
  // TODO: can possibly reduce the measurement by using resizeObserver
  const sectionRect = sectionRef.current?.getBoundingClientRect();
  if (!sectionRect) {
    return {
      scrolledRatio: 0,
      scrollBottom: 0,
      distance: Infinity,
      isIntersecting,
    };
  }

  const { scrollTop, scrollBottom } = getScrollPosition();
  const sectionTop = sectionRect.top + scrollTop;

  const distance = scrollBottom - sectionTop;
  const ratio = clampScrolledRatio(distance / sectionRect.height);

  return { scrolledRatio: ratio, scrollBottom, distance, isIntersecting };
}

/**
 * When the section is visible in the viewport
 * his hook will pass the ratio of the section that is above the bottom of the viewport
 * through the `onScroll` callback.
 * @param sectionRef - The reference to the section element
 * @param onScroll - The callback to track the scroll ratio
 * @param shouldObserve - Whether the underlying IntersectionObserver should be active
 * @param options - The options to pass to the IntersectionObserver
 */
export function useSectionScroll(
  sectionRef: React.RefObject<Element | null>,
  onScroll: (scrollInfo: SectionScrollInfo) => void,
  shouldObserve = true,
  options?: IntersectionObserverOptions
) {
  const handleScroll = useCallback(
    (isIntersecting: boolean) => {
      const scrollInfo = getSectionScrollInfo(sectionRef, isIntersecting);
      onScroll(scrollInfo);
    },
    [sectionRef, onScroll]
  );
  const onPageScroll = useRafThrottle(handleScroll);

  /**
   * Whether the section is on screen, held in a ref.
   *
   * The listener is registered once and reads this, rather than being
   * re-registered per visibility change with the value bound in. `bind`
   * returns a new function every call, so the old code's
   * `removeEventListener(onPageScroll.bind(…))` matched nothing: every section
   * that had ever been seen kept a listener for the life of the page, each one
   * measuring an off-screen element every frame and reporting a frozen
   * `isIntersecting: true`.
   */
  const isIntersectingRef = useRef(false);

  const onObserve = useCallback(
    ({ isIntersecting }: IntersectionObserverEntry) => {
      isIntersectingRef.current = isIntersecting;
      onPageScroll(isIntersecting);
    },
    [onPageScroll]
  );

  useIntersectionObserver(sectionRef, options, shouldObserve, onObserve);

  useEffect(() => {
    if (!shouldObserve) return;

    const listener = () => {
      // Off-screen sections cost nothing: the frame is never scheduled.
      if (isIntersectingRef.current) onPageScroll(true);
    };

    window.addEventListener("scroll", listener, { passive: true });
    return () => window.removeEventListener("scroll", listener);
  }, [onPageScroll, shouldObserve]);
}
