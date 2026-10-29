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

- `useIntersectionObserverState()`: Detect whether an element is in view with the Intersection Observer API.
- `useIntersectionObserver()`: Same as `useIntersectionObserverState()`, but calls `onObserve` instead of updating a state.
- `useIntersectionReveal()`: Detect when an element enters the viewport to trigger animations. Set `trackOnce` to `true` to observe the element only once.
- `useSectionScrollState()`: Provides the scroll progress of a section as a state.
- `useSectionScroll()`: Provides a callback to update the scroll progress without triggering re-renders.
- `useRafThrottle()`: Throttles a callback with `requestAnimationFrame`.
- `useFrameLoop()`: An animation frame loop that can be started and stopped. Return `false` from the callback to stop it.

Documentation: [React Scrollytelling](https://hsunpei.github.io/react-scrollytelling/)
