import { useRef } from 'react';

import { useIntersectionObserver } from '@react-scrollytelling/core';

export const IntersectionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useIntersectionObserver(sectionRef);

  return (
    <section ref={sectionRef} style={{ height: '100vh', backgroundColor: 'lightblue' }}>
      <h1>Intersection Observer</h1>
      <p>isIntersecting: {isIntersecting}</p>
    </section>
  );
};
