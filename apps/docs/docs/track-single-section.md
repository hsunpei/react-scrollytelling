# Track Single Section

import { IntersectionSection } from '../src/components/IntersectionSection';

Detect whether an element is in view with the Intersection Observer API.

<IntersectionSection className="border-green-400 dark:border-green-700 bg-green-200 dark:bg-green-800" />

## Usage

```tsx
import { useIntersectionObserverState } from '@react-scrollytelling/core';

export const IntersectionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isIntersecting } = useIntersectionObserverState(sectionRef);

  return (
    <>
      <section ref={sectionRef}>
        <h1>Intersection Observer</h1>
        <p>isIntersecting: {`${isIntersecting}`}</p>
      </section>
    </>
  );
};
```

## Parameters

The `useIntersectionObserver` hook accepts the following parameters:

```jsx
export function useIntersectionObserver(
  sectionRef: React.RefObject<Element>,
  options: IntersectionObserverOptions,
  shouldObserve: boolean,
  onObserve?: (isIntersecting: IntersectionObserverEntry) => void
) // ...
```

- `sectionRef`: A reference to the element to observe.
- `options`: Allow customizing the observer. You can pass an `IntersectionObserverOptions` [object to configure the observer](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver#instance_properties).
- `shouldObserve`: A boolean that determines whether to observe the element. You can disable the observer by setting this value to `false`. Default value: `true`.
- `onObserve`: A callback function that is called when the element is intersecting. The callback receives an `IntersectionObserverEntry` object as an argument.

## Reveal Effect

Creating a reveal effect on a webpage can significantly enhance user engagement and provide a dynamic browsing experience.
The `useIntersectionReveal()` hook can be employed to detect when an element enters the viewport and trigger animations or transitions.

It can be integrated with CSS animations or JavaScript libraries such as `react-spring` or `framer-motion` to animate text, images,
or other elements as they come into view,
making the content more interactive and visually appealing.

### Usage

`useIntersectionReveal(sectionRef, trackOnce, options)` gives you the ability to track whether the element (tracked with `sectionRef`)
enters the viewport. It takes two arguments:

- `sectionRef`: A reference to the element to observe.
- `trackOnce`: A boolean that determines whether to observe the element only once. Default value: `false`.
- `options`: Allow customizing the observer. You can pass an `IntersectionObserverOptions` [object to configure the observer](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver#instance_properties).

```tsx
import { useIntersectionReveal } from '@react-scrollytelling/core';

// inside a React component
const trackOnce = true;
const sectionRef = useRef<HTMLDivElement>(null);
const { isIntersecting } = useIntersectionReveal(sectionRef, trackOnce);

return (
  <div
    ref={sectionRef}
    style={{
      opacity: isIntersecting ? 1 : 0,
      transform: isIntersecting ? 'translateY(0)' : 'translateY(10px)',
    }}
  >
    Play animation when it enters the viewport
  </div>
);
```

## Scroll Progress Tracking

Track the scroll progress of a single section.

`useSectionScroll()` provides a callback to update the scroll progress without triggering re-renders.
If you are using an animation library like [react-spring](https://react-spring.dev/docs/advanced/spring-value) or [framer-motion](https://www.framer.com/motion/motionvalue/),
you can use the callback to update the animation value.

Alternatively, `useSectionScrollState()` provides the scroll progress as a state, which is just a simple wrapper around `useSectionScroll()`.

### Usage

```tsx
import { useSectionScrollState } from '@react-scrollytelling/core';

export const Section = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isIntersecting, scrolledRatio } = useSectionScrollState(sectionRef);

  return (
    <>
      <section ref={sectionRef}>
        <p>isIntersecting: {`${isIntersecting}`}</p>
        <p>scrolledRatio: {`${scrolledRatio}`}</p>
      </section>
    </>
  );
};
```

### Parameters

The `useSectionScroll` hook accepts the following parameters:

```jsx
export function useSectionScroll(
  sectionRef: React.RefObject<Element>,
  onScroll: (scrollInfo: SectionScrollInfo) => void,
  shouldObserve = true,
  options?: IntersectionObserverOptions
) // ...
```

- `sectionRef`: The reference to the section element.
- `onScroll` - The callback to track the scroll ratio
  - `scrollInfo`: An object that contains the following properties:
    - `isIntersecting`: Whether the section is intersecting with the viewport.
    - `scrollRatio`: The ratio of the section that is above the bottom of the viewport. The value ranges from `0` to `1`.
    - `scrollBottom`: The distance from the top of the page to the page position of the bottom of the viewport (`scrollTop` + `windowHeight`).
    - `distance`: The distance from the top of the section to the bottom of the viewport.
- `shouldObserve`: A boolean that determines whether to observe the element. You can disable the observer by setting this value to `false`. Default value: `true`.
- `options`: Allow customizing the observer. You can pass an `IntersectionObserverOptions` [object to configure the observer](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver#instance_properties).

## Behind the scenes

`useIntersectionReveal()` hook is a simple wrapper around the `useIntersectionObserver()` hook,
which uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when an element enters the viewport, and changes the `isIntersecting` state accordingly,
and disconnect the observer when `trackOnce` is true and the element is already in view.
