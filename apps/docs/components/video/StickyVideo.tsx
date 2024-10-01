import { useEffect, useRef } from 'react';

import { useIntersectionObserverState } from '@react-scrollytelling/core';
import { Video } from '@react-scrollytelling/video';

import { StickyContainer } from '../grouped/StickyContainer';

export interface StickyVideoProps {
  src: string;
  overlay?: React.ReactNode;
}

export const StickyVideo = ({ src, overlay }: StickyVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isIntersecting, disconnect } = useIntersectionObserverState(sectionRef, undefined, true);

  useEffect(() => {
    if (isIntersecting && videoRef.current) {
      videoRef.current.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isIntersecting]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return (
    <StickyContainer overlay={overlay}>
      <div ref={sectionRef}>
        <Video width={600} height={500} src={src} />
      </div>
    </StickyContainer>
  );
};
