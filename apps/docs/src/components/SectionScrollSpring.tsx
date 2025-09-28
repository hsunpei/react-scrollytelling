import { useRef } from 'react';

import { useSectionScrollSpring } from '@react-scrollytelling/react-spring';
import { animated } from '@react-spring/web';

export const SectionScrollSpring = ({ className }: { className: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrolledRatioSpring } = useSectionScrollSpring(sectionRef);

  return (
    <div className="mx-2 my-12">
      <animated.section
        ref={sectionRef}
        style={{
          opacity: scrolledRatioSpring.to((val) => 0.2 + 0.8 * val),
          borderWidth: scrolledRatioSpring.to((val) => `${Math.round(val * 6)}px`),
        }}
        className={`flex h-96 flex-col items-center rounded-lg bg-opacity-20 p-10 drop-shadow-2xl dark:bg-opacity-20 ${className}`}
      >
        <ul className="list-disc text-lg marker:text-slate-400">
          <li>
            scrolledRatio:{' '}
            <animated.span>
              {scrolledRatioSpring.to((val) => {
                return `${Math.round(val * 10000) / 10000}`;
              })}
            </animated.span>
          </li>
        </ul>
      </animated.section>
    </div>
  );
};
