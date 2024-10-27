export interface StickyContainerProps {
  /** Background sticky container */
  children: React.ReactNode;

  /** Overlaying content */
  overlay?: React.ReactNode;

  /** Ref to the background container */
  backgroundRef?: React.RefObject<HTMLDivElement>;
}

export const StickyContainer = ({ overlay, children, backgroundRef }: StickyContainerProps) => {
  return (
    <div style={{ position: 'relative' }}>
      {/* Background */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          paddingBottom: '100vh',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '100vh',
          }}
          ref={backgroundRef}
        >
          {children}
        </div>
      </div>

      {/* Overlay foreground content */}
      <div
        style={{
          position: 'relative',
          marginTop: '-100vh',
        }}
      >
        {overlay}
      </div>
    </div>
  );
};
