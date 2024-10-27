export interface StickyContainerTailwindProps {
  /** Background sticky container */
  children: React.ReactNode;

  /** Overlaying content */
  overlay?: React.ReactNode;

  /** Ref to the background container */
  backgroundRef?: React.RefObject<HTMLDivElement>;
}

export const StickyContainerTailwind = ({
  overlay,
  children,
  backgroundRef,
}: StickyContainerTailwindProps) => {
  return (
    <div className="relative">
      {/* Background */}
      <div className="sticky top-0 pb-[100vh]">
        <div className="absolute left-0 right-0 top-0 h-screen" ref={backgroundRef}>
          {children}
        </div>
      </div>

      {/* Overlay foreground content */}
      <div className="relative -mt-[100vh]">{overlay}</div>
    </div>
  );
};
