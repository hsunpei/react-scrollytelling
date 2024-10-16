import { useRef } from 'react';

import { useSectionScrollState } from '@react-scrollytelling/core';
import { useResizeObserver } from '@react-scrollytelling/layout';
import { Video } from '@react-scrollytelling/video';

import { StickyContainer } from '../grouped/StickyContainer';

export interface StickyVideoProps {
  src: string;
}

export const StickyVideo = ({ src }: StickyVideoProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(videoContainerRef);

  const { scrolledRatio } = useSectionScrollState(sectionRef);

  return (
    <StickyContainer
      overlay={
        <>
          <section className="relative border-green-400" ref={sectionRef} style={{ height }}>
            {/* One video height of the empty space */}
          </section>
          <section
            className="relative border-green-400 dark:border-green-700"
            ref={sectionRef}
            style={{ height }}
          >
            <div
              className="rounded-full bg-emerald-200 bg-opacity-80 px-5 py-1 text-slate-800 backdrop-blur-sm dark:bg-emerald-950 dark:bg-opacity-80 dark:text-slate-200"
              style={{ width: `${scrolledRatio * 100}%` }}
            >
              {Math.round(scrolledRatio * 100)}%
            </div>
          </section>
        </>
      }
    >
      <div ref={videoContainerRef} className="absolute left-0 right-0 top-14 h-screen">
        <Video
          className="h-full w-full object-cover"
          width={width}
          height={height}
          src={src}
          ratio={scrolledRatio}
        />
      </div>
    </StickyContainer>
  );
};
