import { useEffect, useRef } from 'react';

import { useSectionScrollState } from '@react-scrollytelling/core';
import { Video } from '@react-scrollytelling/video';

import { StickyContainer } from '../grouped/StickyContainer';

export interface StickyVideoProps {
  src: string;
}

export const StickyVideo = ({ src }: StickyVideoProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const {} = useSectionScrollState(sectionRef);

  return (
    <StickyContainer
      overlay={
        <>
          <section
            className="border-green-400 bg-green-200 dark:border-green-700 dark:bg-green-800"
            ref={sectionRef}
          >
            Overlay
          </section>
          <section
            className="border-green-400 bg-green-200 dark:border-green-700 dark:bg-green-800"
            ref={sectionRef}
          >
            Overlay
          </section>
        </>
      }
    >
      <div className="absolute left-0 right-0 top-0 h-screen">
        <Video width={600} height={500} src={src} />
      </div>
    </StickyContainer>
  );
};
