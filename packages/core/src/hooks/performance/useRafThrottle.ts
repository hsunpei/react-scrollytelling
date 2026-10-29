import { useCallback, useEffect, useRef } from "react";

/**
 * Use requestAnimationFrame to throttle a callback.
 * The callback is called once per frame with the latest params.
 * @param callback - The callback to throttle by rAF
 * @returns A throttled callback, which does not change between renders
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
        // reset it so the calls are not dropped after a StrictMode remount
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
