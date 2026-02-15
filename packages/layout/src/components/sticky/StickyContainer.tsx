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
}

export const StickyContainer = ({
  overlay,
  children,
  backgroundRef,
  className,
  overlayClassName,
}: StickyContainerProps) => {
  return (
    <div style={{ position: "relative" }} className={className}>
      {/* Background */}
      <div
        style={{
          position: "sticky",
          top: 0,
          paddingBottom: "100vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "100vh",
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
          marginTop: "-100vh",
        }}
        className={overlayClassName}
      >
        {overlay}
      </div>
    </div>
  );
};
