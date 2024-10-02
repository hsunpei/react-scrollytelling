import { useEffect, useRef } from 'react';

export interface VideoProps {
  src: string;
  className?: string;
  width: number;
  height: number;
  percentage?: number;
}

// TODO:
// - Play by percentage
// - thumbnail
// - preload
// - use imperative handle to play

export const Video = ({ src, width, height, percentage = 0, className }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const updateCurrentTime = () => {
        const duration = videoElement.duration;
        if (!isNaN(duration)) {
          videoElement.currentTime = (percentage / 100) * duration;
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
  }, [percentage]);

  return (
    <video
      ref={videoRef}
      width={width}
      height={height}
      src={src}
      className={`h-full w-full object-cover ${className}`}
    ></video>
  );
};
