# @react-scrollytelling/video

A `<Video>` component that plays based on the scroll progress.

## Installation

```bash
npm install @react-scrollytelling/video @react-scrollytelling/core
```

## Usage

Pass the scroll progress of a section to `ratio`, and the video seeks to the same position:

```tsx
import { useRef } from 'react';
import { Video } from '@react-scrollytelling/video';
import { useSectionScrollState } from '@react-scrollytelling/core';

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
- `width`, `height`: Size of the video element.
- `ratio`: The playback position, from `0` to `1`. Default value: `0`.
- `thumbnail`: Thumbnail URL of the video. If not specified, the first frame of the video is used.
- `className`: Class name of the video element.
- `loadingOverlay`: Content to show while the video is loading.

## Smooth playback

If the playback is not smooth, try to re-create the video with a smaller keyframe interval.
Every time the browser seeks to a frame, it has to decode from the previous keyframe, so fewer frames between keyframes means faster seeking.
Scaling the video down to the size it is displayed at also helps.

```
ffmpeg -i input.mp4 -an -vf scale=1440:-2 \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 \
  -g 10 -keyint_min 10 -sc_threshold 0 \
  -movflags +faststart output.mp4
```

`-g` sets the keyframe interval. A smaller value makes seeking faster but the file larger,
so you can try a few values to find what works for your video.

## Loading the video

With `-movflags +faststart`, the browser can load the video with [HTTP range requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Range_requests),
so make sure your server supports them.

See the [documentation](https://hsunpei.github.io/react-scrollytelling/video_playback) for a demo.
