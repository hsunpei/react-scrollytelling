# @react-scrollytelling/react-spring

React Spring integration.

Using a state to do animations can be very expensive in terms of performance.
These hooks update a [SpringValue](https://www.react-spring.dev/docs/advanced/spring-value) with the scroll progress instead,
so you can animate elements without triggering re-renders.

## Installation

```bash
npm install @react-scrollytelling/react-spring @react-scrollytelling/core @react-scrollytelling/grouped @react-spring/web
```

## Usage

### Single section

`useSectionScrollSpring()` returns `scrolledRatioSpring`, which is updated with the scroll progress of the section:

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
      style={{ opacity: scrolledRatioSpring.to((val) => 0.2 + 0.8 * val) }}
    >
      {/* ... */}
    </animated.section>
  );
};
```

### Multiple sections

Inside a `ScrollytellingProvider`, `useActiveSectionSpring()` returns the active section and its scroll progress:

```tsx
import { useActiveSectionSpring } from '@react-scrollytelling/react-spring';

const { trackingId, scrolledRatioSpring } = useActiveSectionSpring();
```

It also returns `trackingIdSpring` and `viewportBtmDistanceSpring`.
See [track grouped sections](https://hsunpei.github.io/react-scrollytelling/track_grouped_sections) for setting up the sections.

See the [documentation](https://hsunpei.github.io/react-scrollytelling/react-spring) for an example.
