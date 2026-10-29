# @react-scrollytelling/react-spring

React Spring integration.

Using a state to do animations can be very expensive in terms of performance.

`react-spring` provides a way to control the styles/text without triggering re-renders.
By using the [SpringValue](https://www.react-spring.dev/docs/advanced/spring-value) with an animated element, you can update the value without triggering re-renders.

react-scrollytelling provides wrappers around `useSectionScroll()` and `useActiveSection()` to update the `SpringValue`, so you can animate the element based on the scroll progress.

## Installation

```bash
npm install @react-scrollytelling/react-spring @react-scrollytelling/core @react-scrollytelling/grouped @react-spring/web
```

## Usage

### Single section

You can use `useSectionScrollSpring()`, which returns `scrolledRatioSpring` updated based on the scroll progress:

```tsx
import { useRef } from 'react';
import { useSectionScrollSpring } from '@react-scrollytelling/react-spring';
import { animated } from '@react-spring/web';

export const Section = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrolledRatioSpring } = useSectionScrollSpring(sectionRef);

  return (
    <animated.section
      ref={sectionRef}
      style={{
        opacity: scrolledRatioSpring.to((val) => 0.2 + 0.8 * val),
        borderWidth: scrolledRatioSpring.to((val) => `${Math.round(val * 6)}px`),
      }}
    >
      {/* ... */}
    </animated.section>
  );
};
```

### Multiple sections

You can follow the example in [track grouped sections](https://hsunpei.github.io/react-scrollytelling/track_grouped_sections) and use `useActiveSectionSpring()` to get the active section information and the updated `SpringValue` based on the scroll progress:

```tsx
import { useActiveSectionSpring } from '@react-scrollytelling/react-spring';

const { trackingId, trackingIdSpring, scrolledRatioSpring, viewportBtmDistanceSpring } = useActiveSectionSpring();
```

Documentation: [React-Spring Integration](https://hsunpei.github.io/react-scrollytelling/react-spring)
