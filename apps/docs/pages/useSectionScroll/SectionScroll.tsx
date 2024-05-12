import { useRef } from 'react';

import { useSectionScroll } from '@react-scrollytelling/core';

export const SectionScroll = ({ className }: { className: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useSectionScroll(sectionRef, undefined, true, () => {
    return null;
  });

  return (
    <div>
      <section ref={sectionRef} className={`my-2 h-36 border-4 p-5 ${className}`}>
        <p>
          isIntersecting: <b>{`${isIntersecting}`}</b>
        </p>
      </section>
    </div>
  );
};
