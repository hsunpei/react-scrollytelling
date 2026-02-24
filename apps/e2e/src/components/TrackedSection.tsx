import { useRef } from 'react';
import { useTrackedSectionScroll } from '@react-scrollytelling/grouped';

interface TrackedSectionProps {
  sectionID: string;
  colorClass: string;
  isFirst?: boolean;
  isLast?: boolean;
}

export const TrackedSection = ({
  sectionID,
  colorClass,
  isFirst,
  isLast,
}: TrackedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null!);
  useTrackedSectionScroll(sectionRef as React.RefObject<Element>, sectionID);

  const classNames = [
    'tracked-section',
    colorClass,
    isFirst ? 'tracked-section--first' : '',
    isLast ? 'tracked-section--last' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section ref={sectionRef} className={classNames} data-testid={`section-${sectionID}`}>
      <div className="tracked-section__label">
        <span>{sectionID}</span>
      </div>
    </section>
  );
};
