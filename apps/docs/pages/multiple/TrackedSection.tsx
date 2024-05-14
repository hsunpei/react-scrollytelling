import { useRef } from 'react';

import { useSectionScrollState } from '@react-scrollytelling/core';

export const TrackedSection = ({ className }: { className: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isIntersecting, scrolledRatio } = useSectionScrollState(sectionRef);

  return (
    <div>
      <section ref={sectionRef} className={`my-2 h-screen border-4 p-10 ${className}`}>
        <p>
          isIntersecting: <b>{`${isIntersecting}`}</b>
        </p>
        <p>
          scrolledRatio: <b>{`${scrolledRatio}`}</b>
        </p>
      </section>
    </div>
  );
};
