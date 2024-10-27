import { useRef } from 'react';

import { useTrackedSectionScroll } from '@react-scrollytelling/grouped';

interface TrackedSectionProps {
  className: string;
  sectionID: string;
}

export const TrackedSection = ({ className, sectionID }: TrackedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useTrackedSectionScroll(sectionRef, sectionID);

  return (
    <section
      ref={sectionRef}
      className={`border-2 bg-opacity-10 p-10 pb-[50vh] drop-shadow-2xl dark:bg-opacity-10 ${className}`}
    >
      <div className="absolute left-2 top-3.5">
        <span className="rounded-lg bg-white bg-opacity-60 p-2 text-slate-500 dark:bg-gray-950">
          {sectionID}
        </span>
      </div>
    </section>
  );
};
