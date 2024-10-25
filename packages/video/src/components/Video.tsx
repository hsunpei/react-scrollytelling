import React, { useEffect, useImperativeHandle, useCallback, useRef, useState } from 'react';

import { useRafThrottle } from '@react-scrollytelling/core';

export interface VideoProps {
  /** Source of the mp4 video */
  src: string;

  /** Source of the webm video */
  srcWebm?: string;

  /**
   * Thumbnail URL of the video.
   * If not specified, it will use the first frame of the video as the thumbnail.
   */
  thumbnail?: string;

  className?: string;
  width: number;
  height: number;
  ratio?: number;

  /** Overlay content to show when the video is loading */
  loadingOverlay?: React.ReactNode;
}

export const Video = ({
  src,
  srcWebm,
  width,
  height,
  thumbnail,
  ratio = 0,
  className,
  loadingOverlay,
}: VideoProps) => {
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
      srcWebm={srcWebm}
      className={className}
      thumbnail={thumbnail}
      loadingOverlay={loadingOverlay}
    ></VideoWithImperativeHandle>
  );
};

export interface VideoRef {
  setRatio: (ratio: number) => void;
}

export const VideoWithImperativeHandle = React.memo(
  React.forwardRef<VideoRef, VideoProps>(
    ({ src, srcWebm, width, height, thumbnail, className, loadingOverlay }, ref) => {
      const videoRef = useRef<HTMLVideoElement>(null);
      const [isLoading, setIsLoading] = useState(true);

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

      const handleWaiting = useCallback(() => {
        console.log('waiting');
        setIsLoading(true);
      }, []);

      const handleCanPlay = useCallback(() => {
        console.log('can play');
        setIsLoading(false);
      }, []);

      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <video
            ref={videoRef}
            width={width}
            height={height}
            className={className}
            muted
            disablePictureInPicture
            disableRemotePlayback
            playsInline
            controls={false}
            // preload the video
            preload="auto"
            onWaiting={handleWaiting}
            onCanPlay={handleCanPlay}
            poster={thumbnail}
          >
            {srcWebm && <source src={thumbnail ? srcWebm : `${srcWebm}#t=0.1`} type="video/webm" />}
            <source src={thumbnail ? src : `${src}#t=0.1`} type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0 }}>{isLoading && loadingOverlay}</div>
        </div>
      );
    }
  )
);
