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
            className="relative border-green-400 bg-green-200 dark:border-green-700 dark:bg-green-800"
            ref={sectionRef}
            style={{ height }}
          >
            {Math.round(scrolledRatio * 100)}%
          </section>
        </>
      }
    >
      <div ref={videoContainerRef} className="absolute left-0 right-0 top-14 h-screen">
        <Video width={width} height={height} src={src} />
      </div>
    </StickyContainer>
  );
};
