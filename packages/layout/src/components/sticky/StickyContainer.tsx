import { type ViewportUnit } from "./viewportUnit";

export interface StickyContainerProps {
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

export const StickyContainer = ({
  overlay,
  children,
  backgroundRef,
  className,
  overlayClassName,
  viewportUnit = "vh",
  backgroundUnit,
}: StickyContainerProps) => {
  // the padding and the negative margin need to use the same unit
  const range = `100${viewportUnit}`;
  const backgroundHeight = `100${backgroundUnit ?? viewportUnit}`;

  return (
    <div style={{ position: "relative" }} className={className}>
      {/* Background */}
      <div
        style={{
          position: "sticky",
          top: 0,
          paddingBottom: range,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: backgroundHeight,
          }}
          ref={backgroundRef}
        >
          {children}
        </div>
      </div>

      {/* Overlay foreground content */}
      <div
        style={{
          position: "relative",
          marginTop: `-${range}`,
        }}
        className={overlayClassName}
      >
        {overlay}
      </div>
    </div>
  );
};
