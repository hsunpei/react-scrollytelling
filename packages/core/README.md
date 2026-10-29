# @react-scrollytelling/core

Core hooks for scroll tracking.

## Installation

```bash
npm install @react-scrollytelling/core
```

## Usage

Track whether an element is in view:

```tsx
import { useRef } from 'react';
import { useIntersectionObserverState } from '@react-scrollytelling/core';

export const Section = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useIntersectionObserverState(sectionRef);

  return (
    <section ref={sectionRef}>
      <p>In view: {`${isIntersecting}`}</p>
    </section>
  );
};
```

Track scroll progress through a section:

```tsx
import { useRef } from 'react';
import { useSectionScrollState } from '@react-scrollytelling/core';

export const Section = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrolledRatio } = useSectionScrollState(sectionRef);

  return (
    <section ref={sectionRef}>
      <p>Progress: {`${(scrolledRatio * 100).toFixed(0)}%`}</p>
    </section>
  );
};
```

## Hooks

- `useIntersectionObserverState(sectionRef, options?, shouldObserve?)`: Whether the element is in view, as a state.
- `useIntersectionObserver(sectionRef, options?, shouldObserve?, onObserve?)`: Calls `onObserve` when the element enters or leaves the viewport, without keeping a state.
- `useIntersectionReveal(sectionRef, trackOnce?, options?)`: Whether the element is in view, for reveal effects. When `trackOnce` is true, it only observes the element once.
- `useSectionScrollState(sectionRef, shouldObserve?, options?)`: The scroll progress of the section, from `0` to `1`, as a state.
- `useSectionScroll(sectionRef, onScroll, shouldObserve?, options?)`: Calls `onScroll` with the scroll progress without triggering re-renders, which is useful for animation libraries.
- `useRafThrottle(callback)`: Calls the callback at most once per animation frame, with the latest arguments.
- `useFrameLoop(callback)`: An animation frame loop that can stop. It returns `start` and `stop`, and the callback can also stop the loop by returning `false`.

`options` are the [options of the Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver#instance_properties).

See the [documentation](https://hsunpei.github.io/react-scrollytelling/) for examples.
