import { BACKGROUND_HEIGHT_CLASS, type ViewportUnit } from "./viewportUnit";

export interface StickyContainerTailwindProps {
  /** Background sticky container */
  children: React.ReactNode;

  /** Overlaying content */
  overlay?: React.ReactNode;

  /** Ref to the background container */
  backgroundRef?: React.RefObject<HTMLDivElement>;

  /** Class name for outer container */
  className?: string;

  /** Class name for the overlay */
  overlayClassName?: string;

  /**
   * Viewport unit of the sticky range. Default value: `vh`.
   * Use `svh` to keep the scroll length the same when the browser toolbars collapse on mobile.
   */
  viewportUnit?: ViewportUnit;

  /**
   * Viewport unit of the background height. Default value: `viewportUnit`.
   * Use `dvh` for a full-screen background.
   */
  backgroundUnit?: ViewportUnit;
}

export const StickyContainerTailwind = ({
  overlay,
  children,
  backgroundRef,
  className,
  overlayClassName,
  viewportUnit = "vh",
  backgroundUnit,
}: StickyContainerTailwindProps) => {
  // the padding and the negative margin need to use the same unit
  const range = `100${viewportUnit}`;
  const backgroundHeight =
    BACKGROUND_HEIGHT_CLASS[backgroundUnit ?? viewportUnit];

  return (
    <div
      id="tw-scope"
      className={className ? `relative ${className}` : "relative"}
    >
      {/* Background */}
      <div className="sticky top-0" style={{ paddingBottom: range }}>
        <div
          className={`absolute left-0 right-0 top-0 ${backgroundHeight}`}
          ref={backgroundRef}
        >
          {children}
        </div>
      </div>

      {/* Overlay foreground content */}
      <div
        className={`relative${overlayClassName ? ` ${overlayClassName}` : ""}`}
        style={{ marginTop: `-${range}` }}
      >
        {overlay}
      </div>
    </div>
  );
};
