import { useRef } from 'react';

import { useSectionScrollState } from '@react-scrollytelling/core';

export const SectionScroll = ({ className }: { className: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isIntersecting, scrolledRatio } = useSectionScrollState(sectionRef);

  return (
    <div className="mx-2 my-12">
      <section
        ref={sectionRef}
        className={`flex h-96 flex-col items-center justify-center rounded-lg border-4 p-10 ${className} `}
      >
        <ul className="list-disc text-lg marker:text-slate-400">
          <li>
            isIntersecting: <b>{`${isIntersecting}`}</b>
          </li>
          <li>
            scrolledRatio: <b>{`${Math.round(scrolledRatio * 10000) / 10000}`}</b>
          </li>
        </ul>
      </section>
    </div>
  );
};
