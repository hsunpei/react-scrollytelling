import { useCallback, useEffect, useRef } from "react";

/**
 * Coalesce a burst of calls into one per animation frame, keeping the **last**
 * arguments seen.
 *
 * Scroll is a stream of samples where only the newest one is true. An earlier
 * implementation kept the first call of each frame and discarded the rest, so
 * a fast flick animated to a position the reader had already left. Params go
 * through a ref, so the frame reads whatever arrived most recently.
 *
 * The callback is read through a ref too: a consumer passing an inline arrow
 * would otherwise change this hook's identity every render, and anything that
 * depends on it — an effect, an observer — would tear down and rebuild.
 *
 * @param callback - The callback to throttle by rAF
 * @returns A throttled callback, stable for the life of the component
 */
export function useRafThrottle<T extends unknown[]>(
  callback: (...params: T) => void
) {
  const rafRef = useRef<number | null>(null);
  const paramsRef = useRef<T | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        // Cleared as well as cancelled: a StrictMode remount reuses this ref,
        // and a stale handle would make the hook think a frame is pending and
        // silently drop every call.
        rafRef.current = null;
      }
      paramsRef.current = null;
    };
  }, []);

  return useCallback((...params: T) => {
    paramsRef.current = params;

    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const latest = paramsRef.current;
      paramsRef.current = null;
      if (latest) callbackRef.current(...latest);
    });
  }, []);
}
