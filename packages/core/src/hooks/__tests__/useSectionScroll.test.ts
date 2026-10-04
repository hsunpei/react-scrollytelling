import { createRef } from "react";
import { renderHook } from "@testing-library/react";

import { useSectionScroll } from "../useSectionScroll";

let observed: ((entry: IntersectionObserverEntry) => void) | null = null;

jest.mock("../intersection/useIntersectionObserver", () => ({
  ...jest.requireActual("../intersection/useIntersectionObserver"),
  useIntersectionObserver: (
    _ref: unknown,
    _options: unknown,
    _shouldObserve: boolean,
    onObserve: (entry: IntersectionObserverEntry) => void
  ) => {
    observed = onObserve;
  },
}));

const enterViewport = (isIntersecting: boolean) =>
  observed?.({ isIntersecting } as IntersectionObserverEntry);

/**
 * The listener used to be added with `onPageScroll.bind(null, isIntersecting)`
 * and removed with another `bind(...)` — a different function object — so it
 * was never removed and never cleaned up on unmount. Every section that had
 * been on screen once kept measuring itself every frame for the life of the
 * page.
 */
describe("useSectionScroll window listener", () => {
  let added: number;
  let removed: number;

  beforeEach(() => {
    observed = null;
    added = 0;
    removed = 0;

    jest.spyOn(window, "addEventListener").mockImplementation((type) => {
      if (type === "scroll") added += 1;
    });
    jest.spyOn(window, "removeEventListener").mockImplementation((type) => {
      if (type === "scroll") removed += 1;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("registers exactly one listener, not one per visibility change", () => {
    const ref = createRef<Element>();
    renderHook(() => useSectionScroll(ref, jest.fn()));

    enterViewport(true);
    enterViewport(false);
    enterViewport(true);

    expect(added).toBe(1);
  });

  it("removes the listener on unmount", () => {
    const ref = createRef<Element>();
    const { unmount } = renderHook(() => useSectionScroll(ref, jest.fn()));

    enterViewport(true);
    unmount();

    expect(removed).toBe(added);
    expect(removed).toBeGreaterThan(0);
  });

  it("registers passively", () => {
    const ref = createRef<Element>();
    const spy = window.addEventListener as jest.Mock;
    renderHook(() => useSectionScroll(ref, jest.fn()));

    const scrollCall = spy.mock.calls.find(([type]) => type === "scroll");
    expect(scrollCall?.[2]).toEqual({ passive: true });
  });

  it("adds no listener when observation is off", () => {
    const ref = createRef<Element>();
    renderHook(() => useSectionScroll(ref, jest.fn(), false));

    expect(added).toBe(0);
  });
});
