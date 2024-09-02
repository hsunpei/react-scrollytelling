export interface StickyContainerProps {
  /** Background sticky container */
  children: React.ReactNode;

  /** Overlaying content */
  overlay?: React.ReactNode;
}

export const StickyContainer = ({ overlay, children }: StickyContainerProps) => {
  return (
    <div className="relative">
      {/* Background */}
      <div className="sticky top-0 pb-[100vh]">{children}</div>

      {/* Overlay foreground content */}
      <div className="relative -mt-[100vh]">{overlay}</div>
    </div>
  );
};
