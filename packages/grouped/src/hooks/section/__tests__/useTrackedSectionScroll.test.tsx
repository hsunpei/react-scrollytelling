import { createRef } from "react";
import { act, render } from "@testing-library/react";

import { useTrackedSectionScroll } from "../useTrackedSectionScroll";
import { TrackedSections } from "../../../context/grouped/TrackedSections";
import { useScrollytelling } from "../../grouped/useScrollytelling";

jest.mock("../../grouped/useScrollytelling");

jest.mock("@react-scrollytelling/core", () => ({
  ...jest.requireActual("@react-scrollytelling/core"),
  // The real one needs a live IntersectionObserver; the section's own
  // registration is what these cases are about.
  useIntersectionObserver: jest.fn(),
}));

const mockedUseScrollytelling = useScrollytelling as jest.MockedFunction<
  typeof useScrollytelling
>;

/**
 * The section is a viewport tall, which is how every scrollytelling layout is
 * built — so when the viewport height changes, so does the section, and so
 * does every offset below it.
 */
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
    // jsdom implements no visualViewport, which is the one event an in-app
    // browser reliably fires when its toolbars move.
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

    // The toolbar goes away: the viewport grows and the section grows with it.
    setViewportHeight(660, 0);
    act(() => {
      window.visualViewport?.dispatchEvent(new Event("resize"));
    });

    // Measured once at mount this would still read 600, and the ratio — which
    // divides a live innerHeight by these offsets — would step by 60/600.
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

    // A section above grew, so this one moved without changing size.
    setViewportHeight(600, 120);
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(trackedSections.getSection("section-1")?.sectionTop).toBe(120);
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
