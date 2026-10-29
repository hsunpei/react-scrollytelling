import { useCallback, useEffect, useRef } from "react";

/** The data passed to the callback on each frame */
export interface FrameTick {
  /** The rAF timestamp of the frame */
  timestamp: number;
  /** Milliseconds since the previous frame, 1000/60 on the first frame */
  delta: number;
}

/**
 * Called on each frame while the loop is running.
 * Return `false` to stop the loop, e.g. when an animation is finished.
 */
export type FrameLoopCallback = (data: FrameTick) => boolean | void;

/** The delta of the first frame, same as most animation libraries */
const FIRST_FRAME_DELTA = 1000 / 60;

/** Limit the delta to avoid a big jump when switching back to a background tab */
const MAX_DELTA = 64;

/**
 * An animation frame loop that can be started and stopped.
 *
 * Unlike `useAnimationFrame()` of motion, it does not run for the whole lifetime of the component.
 * Call `stop()` or return `false` from the callback to stop it.
 *
 * The next frame is requested before running the callback,
 * so the loop runs before the frames requested by the callback, e.g. a map redrawing.
 *
 * @param callback - Called on each frame. The latest callback is always used.
 */
export function useFrameLoop(callback: FrameLoopCallback) {
  const callbackRef = useRef(callback);
  const runningRef = useRef(false);
  const frameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // use the latest callback without restarting the loop
  useEffect(() => {
    callbackRef.current = callback;
  });

  const stop = useCallback(() => {
    runningRef.current = false;
    if (frameIdRef.current !== null) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }
  }, []);

  // request the next frame until the loop is stopped
  const tick = useCallback(function tickFn(timestamp: number) {
    // request the next frame before running the callback
    frameIdRef.current = requestAnimationFrame(tickFn);

    const last = lastTimestampRef.current;
    lastTimestampRef.current = timestamp;
    const delta =
      last === null
        ? FIRST_FRAME_DELTA
        : Math.min(Math.max(timestamp - last, 1), MAX_DELTA);

    if (callbackRef.current({ timestamp, delta }) === false) {
      runningRef.current = false;
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    }
  }, []);

  const start = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    lastTimestampRef.current = null;
    frameIdRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const isRunning = useCallback(() => runningRef.current, []);

  // stop the loop when the component is unmounted
  useEffect(() => stop, [stop]);

  return { start, stop, isRunning };
}
