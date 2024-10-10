import React, { useEffect, useImperativeHandle, useRef } from 'react';

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
// - loadedmetadata

export const Video = ({ src, width, height, ratio = 0, className }: VideoProps) => {
  const videoRef = useRef<VideoRef>(null);

  useEffect(() => {
    // update currentTime when the percentage prop changes
    if (!videoRef.current) {
      return;
    }

    videoRef.current.setRatio(ratio);
  }, [ratio]);

  return (
    <VideoWithImperativeHandle
      ref={videoRef}
      width={width}
      height={height}
      src={src}
      className={className}
    ></VideoWithImperativeHandle>
  );
};

export interface VideoRef {
  setRatio: (ratio: number) => void;
}

export const VideoWithImperativeHandle = React.memo(
  React.forwardRef<VideoRef, VideoProps>(({ src, width, height, className }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          setRatio: (ratio: number) => {
            const videoElement = videoRef.current;
            if (!videoElement) {
              return;
            }

            const duration = videoElement.duration;
            if (!isNaN(duration)) {
              videoElement.currentTime = ratio * duration;
            }
          },
        };
      },
      []
    );

    return (
      <video ref={videoRef} width={width} height={height} src={src} className={className}></video>
    );
  })
);
