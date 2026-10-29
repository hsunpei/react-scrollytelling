# @react-scrollytelling/video

Scroll-driven video playback.

## Installation

```bash
npm install @react-scrollytelling/video @react-scrollytelling/core
```

## Usage

You could use the `<Video>` component to create a video that plays based on the scroll progress:

```tsx
import { useRef } from "react";
import { Video } from "@react-scrollytelling/video";
import { useSectionScrollState } from "@react-scrollytelling/core";

export const ScrollVideo = ({ src }: { src: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrolledRatio } = useSectionScrollState(sectionRef);

  return (
    <section ref={sectionRef}>
      <Video src={src} width={1440} height={810} ratio={scrolledRatio} />
    </section>
  );
};
```

## Props

- `src`: Source of the mp4 video.
- `srcWebm`: Source of the webm video. Optional.
- `width`, `height`: The size of the video.
- `ratio`: The scroll progress, from `0` to `1`. Default value: `0`.
- `thumbnail`: Thumbnail URL of the video. If not specified, it will use the first frame of the video as the thumbnail.
- `className`: The class name of the video.
- `loadingOverlay`: Overlay content to show when the video is loading.

## Smooth playback

If the playback is not smooth, try to re-create the video with a smaller keyframe interval.
See [Smooth playback](https://hsunpei.github.io/react-scrollytelling/video_playback#smooth-playback) in the documentation for an example.

Documentation: [Video Playback](https://hsunpei.github.io/react-scrollytelling/video_playback)
