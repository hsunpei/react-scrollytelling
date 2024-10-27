import { useRef } from 'react';

import { useSectionScrollState } from '@react-scrollytelling/core';
import { useResizeObserver } from '@react-scrollytelling/layout';
import { StickyContainerTailwind } from '@react-scrollytelling/layout';
import { Video } from '@react-scrollytelling/video';

export interface StickyVideoProps {
  src: string;
}

export const StickyVideo = ({ src }: StickyVideoProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(videoContainerRef);

  const { scrolledRatio } = useSectionScrollState(sectionRef);

  return (
    <StickyContainerTailwind
      overlay={
        <>
          <section className="border-green-400" ref={sectionRef} style={{ height }}>
            {/* One video height of the empty space */}
          </section>
          <section
            className="border-green-400 dark:border-green-700"
            ref={sectionRef}
            style={{ height }}
          >
            <div
              className="min-w-20 rounded-full bg-emerald-200 bg-opacity-80 px-5 py-1 text-slate-800 backdrop-blur-sm dark:bg-emerald-950 dark:bg-opacity-80 dark:text-slate-200"
              style={{ width: `${scrolledRatio * 100}%` }}
            >
              {Math.round(scrolledRatio * 100)}%
            </div>
          </section>
        </>
      }
      backgroundRef={videoContainerRef}
    >
      <Video
        className="h-full w-full object-cover"
        width={width}
        height={height}
        src={src}
        ratio={scrolledRatio}
      />
    </StickyContainerTailwind>
  );
};
