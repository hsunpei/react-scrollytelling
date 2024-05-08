import { useRef } from 'react';

import { useIntersectionObserver } from '@react-scrollytelling/core';

export const IntersectionSection = ({ className }: { className: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useIntersectionObserver(sectionRef);

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
