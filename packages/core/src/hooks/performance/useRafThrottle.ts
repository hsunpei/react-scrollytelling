import { useCallback, useEffect, useRef } from 'react';

/**
 * Use requestAnimationFrame to throttle a callback
 * @param callback - The callback to throttle by rAF
 * @returns A throttled callback
 */
export function useRafThrottle(callback: () => void) {
  const rafRef = useRef<number | null>(null);

  const rafCallback = useCallback(() => {
    callback();
    rafRef.current = null;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(rafCallback);
    }
  }, [rafCallback]);
}
