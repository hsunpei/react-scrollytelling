import { act, renderHook } from "@testing-library/react";

import { useRafThrottle } from "../useRafThrottle";

/** Hold frames so a test can decide when one runs. */
function captureFrames() {
  const queued: FrameRequestCallback[] = [];
  let next = 1;

  jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    queued.push(cb);
    return next++;
  });
  jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

  return {
    get pending() {
      return queued.length;
    },
    run() {
      const due = queued.splice(0, queued.length);
      act(() => {
        due.forEach((cb) => cb(performance.now()));
      });
    },
  };
}

describe("useRafThrottle", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("delivers the last arguments of the frame, not the first", () => {
    const frames = captureFrames();
    const spy = jest.fn();
    const { result } = renderHook(() => useRafThrottle(spy));

    // A scroll burst inside one frame. Only the newest position is true; the
    // earlier ones describe somewhere the reader has already left.
    act(() => {
      result.current(0);
      result.current(120);
      result.current(340);
    });

    expect(spy).not.toHaveBeenCalled();
    frames.run();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(340);
  });

  it("schedules one frame per burst", () => {
    const frames = captureFrames();
    const { result } = renderHook(() => useRafThrottle(jest.fn()));

    act(() => {
      result.current(1);
      result.current(2);
      result.current(3);
    });

    expect(frames.pending).toBe(1);
  });

  it("accepts a new burst once the frame has run", () => {
    const frames = captureFrames();
    const spy = jest.fn();
    const { result } = renderHook(() => useRafThrottle(spy));

    act(() => result.current("a"));
    frames.run();
    act(() => result.current("b"));
    frames.run();

    expect(spy.mock.calls).toEqual([["a"], ["b"]]);
  });

  it("calls the newest callback, not the one captured at mount", () => {
    const frames = captureFrames();
    const first = jest.fn();
    const second = jest.fn();
    const { result, rerender } = renderHook<
      (...params: never[]) => void,
      { cb: () => void }
    >(({ cb }) => useRafThrottle(cb), { initialProps: { cb: first } });

    act(() => result.current());
    rerender({ cb: second });
    frames.run();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("keeps one identity across renders", () => {
    const { result, rerender } = renderHook<
      (...params: never[]) => void,
      { cb: () => void }
    >(({ cb }) => useRafThrottle(cb), { initialProps: { cb: jest.fn() } });

    const before = result.current;
    rerender({ cb: jest.fn() });

    // An unstable identity rebuilds every observer and effect downstream.
    expect(result.current).toBe(before);
  });

  it("does not run a frame queued before unmount", () => {
    const frames = captureFrames();
    const spy = jest.fn();
    const { result, unmount } = renderHook(() => useRafThrottle(spy));

    act(() => result.current());
    unmount();
    frames.run();

    expect(spy).not.toHaveBeenCalled();
  });
});
