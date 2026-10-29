import { createRef } from "react";
import { act, render } from "@testing-library/react";

import { useTrackedSectionScroll } from "../useTrackedSectionScroll";
import { TrackedSections } from "../../../context/grouped/TrackedSections";
import { useScrollytelling } from "../../grouped/useScrollytelling";

jest.mock("../../grouped/useScrollytelling");

jest.mock("@react-scrollytelling/core", () => ({
  ...jest.requireActual("@react-scrollytelling/core"),
  // mocked since jsdom has no IntersectionObserver
  useIntersectionObserver: jest.fn(),
}));

const mockedUseScrollytelling = useScrollytelling as jest.MockedFunction<
  typeof useScrollytelling
>;

function mountSection() {
  const ref = createRef<HTMLDivElement>();

  const Section = () => {
    useTrackedSectionScroll(
      ref as React.RefObject<Element>,
      "section-1",
      undefined
    );
    return <div ref={ref} />;
  };

  const view = render(<Section />);
  return { ref, view };
}

/** Set the viewport height. The section is as tall as the viewport, like most scrollytelling layouts. */
function setViewportHeight(height: number, elementTop: number) {
  (window as { innerHeight: number }).innerHeight = height;
  jest
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockReturnValue({
      top: elementTop,
      bottom: elementTop + height,
      height,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: elementTop,
      toJSON: () => ({}),
    } as DOMRect);
}

describe("a section whose viewport changes height", () => {
  let trackedSections: TrackedSections;

  beforeAll(() => {
    // jsdom has no visualViewport, add one to fire its resize event
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: new EventTarget(),
    });
  });

  beforeEach(() => {
    trackedSections = new TrackedSections();
    mockedUseScrollytelling.mockReturnValue({
      trackedSections,
    } as ReturnType<typeof useScrollytelling>);
    window.scrollY = 0;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("re-measures when the browser collapses its toolbars", () => {
    setViewportHeight(600, 0);
    mountSection();

    expect(trackedSections.getSection("section-1")?.sectionBottom).toBe(600);

    // the viewport and the section get taller when the toolbars are hidden
    setViewportHeight(660, 0);
    act(() => {
      window.visualViewport?.dispatchEvent(new Event("resize"));
    });

    // it would still be 600 if the section was only measured on mount
    expect(trackedSections.getSection("section-1")?.sectionBottom).toBe(660);
  });

  it("re-measures on a plain window resize too", () => {
    setViewportHeight(600, 0);
    mountSection();

    setViewportHeight(500, 0);
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(trackedSections.getSection("section-1")?.sectionBottom).toBe(500);
  });

  it("follows the section when it is pushed down the document", () => {
    setViewportHeight(600, 0);
    mountSection();

    // this section moved down without resizing because a section above got taller
    setViewportHeight(600, 120);
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(trackedSections.getSection("section-1")?.sectionTop).toBe(120);
  });

  it("does not put the section back in the viewport set when it resizes", () => {
    setViewportHeight(600, 0);
    mountSection();

    // the section is removed from the sections in the viewport after scrolling past it
    trackedSections.untrackSection("section-1");
    expect(trackedSections.findClosestToBottomId(0, 600)).toBe("section-1");

    setViewportHeight(660, 0);
    act(() => {
      window.visualViewport?.dispatchEvent(new Event("resize"));
    });

    expect(trackedSections.getSection("section-1")?.sectionBottom).toBe(660);

    const tracked = trackedSections as unknown as {
      trackedSections: Map<string, unknown>;
    };
    expect(tracked.trackedSections.has("section-1")).toBe(false);
  });

  it("stops listening once the section unmounts", () => {
    setViewportHeight(600, 0);
    const { view } = mountSection();

    view.unmount();

    expect(() => {
      window.dispatchEvent(new Event("resize"));
      window.visualViewport?.dispatchEvent(new Event("resize"));
    }).not.toThrow();
    expect(trackedSections.getSection("section-1")).toBeUndefined();
  });
});
