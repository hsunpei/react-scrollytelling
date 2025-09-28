# Core Hooks

The core package provides essential hooks for scroll-triggered interactions.

## useIntersectionObserver

Detects when an element enters or leaves the viewport.

```tsx
import { useIntersectionObserver } from '@react-scrollytelling/core';

function MyComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const { isIntersecting, disconnect } = useIntersectionObserver(ref);

  return <div ref={ref}>{isIntersecting ? 'In viewport' : 'Out of viewport'}</div>;
}
```

## useSectionScroll

Tracks the scroll progress of a specific section.

```tsx
import { useSectionScroll } from '@react-scrollytelling/core';

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useSectionScroll(ref, (scrollInfo) => {
    console.log('Scroll ratio:', scrollInfo.scrolledRatio);
  });

  return <div ref={ref}>Scroll to see progress</div>;
}
```

## useRafThrottle

Throttles a callback function using `requestAnimationFrame`.

```tsx
import { useRafThrottle } from '@react-scrollytelling/core';

function ThrottledComponent() {
  const throttledCallback = useRafThrottle((value) => {
    console.log('Throttled:', value);
  });

  return <div>Throttled interactions</div>;
}
```
