import { useRef } from 'react';

import { useIntersectionObserverState } from '@react-scrollytelling/core';

import { AnimatedTrail } from './AnimatedTrail';

export const Reveal = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useIntersectionObserverState(sectionRef);

  return (
    <div className="py-10" ref={sectionRef}>
      <AnimatedTrail
        title="Lorem ipsum dolor sit"
        className="text-green-500"
        isIntersecting={isIntersecting}
      />
      <div
        className="py-5 text-slate-500 transition-all delay-700 ease-in-out"
        style={{
          opacity: isIntersecting ? 1 : 0,
          transform: isIntersecting ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
      </div>
    </div>
  );
};
