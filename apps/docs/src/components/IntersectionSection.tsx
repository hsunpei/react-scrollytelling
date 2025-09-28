import { useRef } from 'react';

import { useIntersectionObserverState } from '@react-scrollytelling/core';

export const IntersectionSection = ({ className }: { className: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useIntersectionObserverState(sectionRef);

  return (
    <div className="mx-2 my-12">
      <section
        ref={sectionRef}
        className={`flex h-96 flex-col items-center justify-center rounded-lg border-2 bg-opacity-20 p-10 drop-shadow-2xl dark:bg-opacity-20 ${className}`}
      >
        <ul className="list-disc text-lg marker:text-slate-400">
          <li>
            isIntersecting: <b>{`${isIntersecting}`}</b>
          </li>
        </ul>
      </section>
    </div>
  );
};
