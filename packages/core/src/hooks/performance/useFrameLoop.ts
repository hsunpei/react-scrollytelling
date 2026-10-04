import { useCallback, useEffect, useRef } from "react";

/** What the loop hands its callback each frame. */
export interface FrameTick {
  /** The rAF timestamp for this frame. */
  timestamp: number;
  /** Milliseconds since the previous frame; 1000/60 on the first one. */
  delta: number;
}

/**
 * The loop callback. Runs once per animation frame while the loop is started.
 * Return `false` to stop the loop — e.g. once an animation has settled —
 * or anything else (including `undefined`) to keep running.
 */
export type FrameLoopCallback = (data: FrameTick) => boolean | void;

/** Matches the first-frame delta animation libraries assume. */
const FIRST_FRAME_DELTA = 1000 / 60;

/** A backgrounded tab must not produce one huge jump on return. */
const MAX_DELTA = 64;

/**
 * An animation frame loop you can actually stop.
 *
 * Most `useAnimationFrame` implementations keep the loop alive for the
 * component's whole lifetime and leave you to no-op inside it — which still
 * costs a callback every frame forever. This exposes explicit `start`/`stop`,
 * so the loop genuinely ends when there is no work, and the callback can stop
 * it by returning `false` once an animation settles.
 *
 * **It schedules the next frame before running the callback, and that ordering
 * is deliberate.** Frame callbacks run in registration order, and one
 * registered while the frame is already running belongs to the *next* frame.
 * So if the callback's own work causes something else to schedule a paint
 * from inside this frame — a canvas or map library redrawing, say — a loop
 * that re-arms first stays ahead of it, and both land on the same frame.
 * Re-arming after the work loses that race every frame, and the only remedy
 * left is forcing a synchronous repaint, which costs a second paint.
 *
 * The latest `callback` is always used without restarting the loop, so it can
 * close over fresh render state directly.
 */
export function useFrameLoop(callback: FrameLoopCallback) {
  const callbackRef = useRef(callback);
  const runningRef = useRef(false);
  const frameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Keep the newest callback so the running loop reads fresh closure values
  // without cancelling and re-scheduling.
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

  // Stable identity across renders; re-arms itself until stopped.
  const tick = useCallback(function tickFn(timestamp: number) {
    // Before the work, never after — see the note on ordering above.
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

  // Never leave a loop running after the component is gone.
  useEffect(() => stop, [stop]);

  return { start, stop, isRunning };
}
