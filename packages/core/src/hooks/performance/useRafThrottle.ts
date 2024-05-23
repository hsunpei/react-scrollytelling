import { useCallback, useEffect, useRef } from 'react';

/**
 * Use requestAnimationFrame to throttle a callback
 * @param callback - The callback to throttle by rAF
 * @returns A throttled callback
 */
export function useRafThrottle<T extends unknown[]>(callback: (...params: T) => void) {
  const rafRef = useRef<number | null>(null);

  const rafCallback = useCallback(
    (...params: T) => {
      callback(...params);
      rafRef.current = null;
    },
    [callback]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return useCallback(
    (...params: T) => {
      const funcToCall = () => rafCallback(...params);

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(funcToCall);
      }
    },
    [rafCallback]
  );
}
