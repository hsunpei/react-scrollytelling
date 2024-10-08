import React, { useEffect, useRef } from 'react';

export interface VideoProps {
  src: string;
  className?: string;
  width: number;
  height: number;
  ratio?: number;
}

// TODO:
// - thumbnail
// - preload
// - use imperative handle to play instead of changing through props

export const Video = React.memo(({ src, width, height, ratio = 0, className }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const updateCurrentTime = () => {
        const duration = videoElement.duration;
        if (!isNaN(duration)) {
          videoElement.currentTime = ratio * duration;
        }
      };

      // update currentTime when the video metadata is loaded
      videoElement.addEventListener('loadedmetadata', updateCurrentTime);

      // update currentTime when the percentage prop changes
      updateCurrentTime();

      return () => {
        videoElement.removeEventListener('loadedmetadata', updateCurrentTime);
      };
    }
  }, [ratio]);

  return (
    <video
      ref={videoRef}
      width={width}
      height={height}
      src={src}
      className={`h-full w-full object-cover ${className}`}
    ></video>
  );
});
