import { act, renderHook } from "@testing-library/react";

import { useFrameLoop } from "../useFrameLoop";

/** Drive frames by hand so a test controls the clock. */
function captureFrames() {
  let queued: Array<{ id: number; cb: FrameRequestCallback }> = [];
  let next = 1;

  jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    const id = next++;
    queued.push({ id, cb });
    return id;
  });
  jest.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
    queued = queued.filter((f) => f.id !== id);
  });

  return {
    get pending() {
      return queued.length;
    },
    advance(timestamp: number) {
      const due = queued.splice(0, queued.length);
      act(() => {
        due.forEach(({ cb }) => cb(timestamp));
      });
    },
  };
}

describe("useFrameLoop", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("runs nothing until started", () => {
    const frames = captureFrames();
    const spy = jest.fn();
    renderHook(() => useFrameLoop(spy));

    expect(frames.pending).toBe(0);
    expect(spy).not.toHaveBeenCalled();
  });

  it("runs once per frame while started", () => {
    const frames = captureFrames();
    const spy = jest.fn();
    const { result } = renderHook(() => useFrameLoop(spy));

    act(() => result.current.start());
    frames.advance(100);
    frames.advance(116);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(result.current.isRunning()).toBe(true);
  });

  it("stops when the callback returns false", () => {
    const frames = captureFrames();
    const spy = jest.fn().mockReturnValueOnce(undefined).mockReturnValue(false);
    const { result } = renderHook(() => useFrameLoop(spy));

    act(() => result.current.start());
    frames.advance(100);
    frames.advance(116);

    expect(result.current.isRunning()).toBe(false);
    expect(frames.pending).toBe(0);

    // The point of the hook: a settled animation costs nothing per frame.
    frames.advance(132);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("stops on request and restarts cleanly", () => {
    const frames = captureFrames();
    const spy = jest.fn();
    const { result } = renderHook(() => useFrameLoop(spy));

    act(() => result.current.start());
    frames.advance(100);
    act(() => result.current.stop());
    expect(frames.pending).toBe(0);

    act(() => result.current.start());
    frames.advance(200);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("ignores a second start while running", () => {
    const frames = captureFrames();
    const { result } = renderHook(() => useFrameLoop(jest.fn()));

    act(() => {
      result.current.start();
      result.current.start();
    });

    // Two loops would double every callback for the component's lifetime.
    expect(frames.pending).toBe(1);
  });

  it("clamps the delta so a backgrounded tab does not jump", () => {
    const frames = captureFrames();
    const deltas: number[] = [];
    const { result } = renderHook(() =>
      useFrameLoop(({ delta }) => {
        deltas.push(delta);
      })
    );

    act(() => result.current.start());
    frames.advance(0);
    frames.advance(16);
    frames.advance(10_000);

    expect(deltas[0]).toBeCloseTo(1000 / 60);
    expect(deltas[1]).toBe(16);
    expect(deltas[2]).toBe(64);
  });

  it("re-arms before running the callback, so it stays ahead of work it triggers", () => {
    const frames = captureFrames();
    let pendingDuringCallback = -1;
    const { result } = renderHook(() =>
      useFrameLoop(() => {
        pendingDuringCallback = frames.pending;
      })
    );

    act(() => result.current.start());
    frames.advance(100);

    expect(pendingDuringCallback).toBe(1);
  });

  it("uses the newest callback without restarting", () => {
    const frames = captureFrames();
    const first = jest.fn();
    const second = jest.fn();
    const { result, rerender } = renderHook<
      ReturnType<typeof useFrameLoop>,
      { cb: () => void }
    >(({ cb }) => useFrameLoop(cb), { initialProps: { cb: first } });

    act(() => result.current.start());
    frames.advance(100);
    rerender({ cb: second });
    frames.advance(116);

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    expect(result.current.isRunning()).toBe(true);
  });

  it("stops on unmount", () => {
    const frames = captureFrames();
    const { result, unmount } = renderHook(() => useFrameLoop(jest.fn()));

    act(() => result.current.start());
    unmount();

    expect(frames.pending).toBe(0);
  });
});
