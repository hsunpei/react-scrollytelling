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
}

export const StickyContainerTailwind = ({
  overlay,
  children,
  backgroundRef,
  className,
  overlayClassName,
}: StickyContainerTailwindProps) => {
  return (
    <div id="tw-scope" className={className ? `relative ${className}` : 'relative'}>
      {/* Background */}
      <div className="sticky top-0 pb-[100vh]">
        <div className="absolute left-0 right-0 top-0 h-screen" ref={backgroundRef}>
          {children}
        </div>
      </div>

      {/* Overlay foreground content */}
      <div className={`relative -mt-[100vh]${overlayClassName ? ` ${overlayClassName}` : ''}`}>
        {overlay}
      </div>
    </div>
  );
};
