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
   * Viewport unit the sticky range is measured in. Defaults to `vh`.
   *
   * `svh` keeps the scroll length fixed while a mobile or in-app browser
   * collapses its toolbars. See {@link ViewportUnit}.
   */
  viewportUnit?: ViewportUnit;

  /**
   * Viewport unit for the pinned background's height. Defaults to
   * `viewportUnit`.
   *
   * Worth setting to `dvh` when the background is full-bleed — a map or a
   * photo — so it still reaches the bottom edge once the toolbars are gone,
   * while `viewportUnit` keeps the scroll length itself stable.
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
  // The spacer and the pull-up have to cancel exactly, so they share a unit.
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
