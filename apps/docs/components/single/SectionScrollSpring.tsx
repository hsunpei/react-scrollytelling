import { useRef } from 'react';

import { useSectionScrollSpring } from '@react-scrollytelling/react-spring';
import { animated } from '@react-spring/web';

export const SectionScrollSpring = ({ className }: { className: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrolledRatioSpring } = useSectionScrollSpring(sectionRef);

  return (
    <div className="mx-2 my-12">
      <section
        ref={sectionRef}
        className={`flex h-96 flex-col items-center justify-center rounded-lg border-2 bg-opacity-20 p-10 drop-shadow-2xl dark:bg-opacity-20 ${className}`}
      >
        <ul className="list-disc text-lg marker:text-slate-400">
          <li>
            scrolledRatio:{' '}
            <animated.span>
              {scrolledRatioSpring.to((val) => {
                console.log(val, Math.round(val * 10000) / 10000);
                return `${Math.round(val * 10000) / 10000}`;
              })}
            </animated.span>
          </li>
        </ul>
      </section>
    </div>
  );
};
