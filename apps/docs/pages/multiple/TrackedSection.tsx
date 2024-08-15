import { useCallback, useRef, useState } from 'react';

import { useTrackedSectionScroll } from '@react-scrollytelling/core';
import type { SectionScrollInfo } from '@react-scrollytelling/core';

interface TrackedSectionProps {
  className: string;
  sectionID: string;
}

export const TrackedSection = ({ className, sectionID }: TrackedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const [scrolledInfo, setScrolledInfo] = useState<SectionScrollInfo>({
    scrolledRatio: 0,
    distance: 0,
  });

  const handleScroll = useCallback((scrollInfo: SectionScrollInfo) => {
    console.log('TrackedSection > handleScroll', scrollInfo);
    setScrolledInfo(scrollInfo);
  }, []);

  useTrackedSectionScroll(sectionRef, sectionID, handleScroll);

  return (
    <section
      ref={sectionRef}
      className={`relative border-2 bg-opacity-30 p-10 pb-[50vh] drop-shadow-2xl dark:bg-opacity-20 ${className}`}
    >
      <div className="absolute left-2 top-3.5">
        <span className="rounded-lg bg-white bg-opacity-60 p-2 text-slate-500 dark:bg-gray-950">
          {sectionID}
        </span>
      </div>
    </section>
  );
};
