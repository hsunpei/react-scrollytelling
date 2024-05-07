import { useRef } from 'react';

import { useIntersectionObserver } from '@react-scrollytelling/core';

export const IntersectionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useIntersectionObserver(sectionRef);

  return (
    <section ref={sectionRef} className="h-3/4 bg-cyan-100 dark:bg-cyan-800">
      <h1>Intersection Observer</h1>
      <p>isIntersecting: {isIntersecting}</p>
    </section>
  );
};
