import { useCallback, useRef, useState } from 'react';

import { useTrackedSectionScroll, SectionScrollInfo } from '@react-scrollytelling/core';

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
    setScrolledInfo(scrollInfo);
  }, []);

  const { isIntersecting } = useTrackedSectionScroll(sectionRef, sectionID, handleScroll);

  return (
    <div>
      <section ref={sectionRef} className={`border-4 p-10 pb-[50vh] ${className}`}>
        <p>
          isIntersecting: <b>{`${isIntersecting}`}</b>
        </p>
        <p>
          scrolledRatio: <b>{`${scrolledInfo.scrolledRatio}`}</b>
        </p>
      </section>
    </div>
  );
};
