import React, { useEffect, useImperativeHandle, useCallback, useRef } from 'react';

import { useRafThrottle } from '@react-scrollytelling/core';

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
    // update currentTime when the ratio prop changes
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

    const setVideoRatio = useCallback((ratio: number) => {
      const videoElement = videoRef.current;
      if (!videoElement) {
        return;
      }

      const duration = videoElement.duration;
      if (!isNaN(duration)) {
        requestAnimationFrame(() => {
          videoElement.currentTime = Math.round(ratio * duration * 100) / 100;
          console.log('setRatio', ratio, Math.round(ratio * duration * 100) / 100);
        });
      }
    }, []);
    const setVideoRatioThrottled = useRafThrottle(setVideoRatio);

    useImperativeHandle(
      ref,
      () => {
        return {
          setRatio: setVideoRatioThrottled,
        };
      },
      [setVideoRatioThrottled]
    );

    return (
      <video
        ref={videoRef}
        width={width}
        height={height}
        src={src}
        className={className}
        muted
        disablePictureInPicture
        disableRemotePlayback
        playsInline
        controls={false}
      ></video>
    );
  })
);
