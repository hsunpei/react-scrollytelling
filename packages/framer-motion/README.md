# @react-scrollytelling/framer-motion

Framer Motion integration.

Using a state to do animations can be very expensive in terms of performance.
These hooks update a [MotionValue](https://motion.dev/docs/react-motion-value) with the scroll progress instead,
so you can animate elements without triggering re-renders.

## Installation

```bash
npm install @react-scrollytelling/framer-motion @react-scrollytelling/core @react-scrollytelling/grouped motion
```

## Usage

### Single section

`useSectionScrollMotionValue()` returns `scrolledRatioMotionValue`, which is updated with the scroll progress of the section:

```tsx
import { useRef } from 'react';
import { useSectionScrollMotionValue } from '@react-scrollytelling/framer-motion';
import { motion, useTransform } from 'motion/react';

export const Section = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrolledRatioMotionValue } = useSectionScrollMotionValue(sectionRef);
  const opacity = useTransform(scrolledRatioMotionValue, (val) => 0.2 + 0.8 * val);

  return (
    <motion.section ref={sectionRef} style={{ opacity }}>
      {/* ... */}
    </motion.section>
  );
};
```

### Multiple sections

Inside a `ScrollytellingProvider`, `useActiveSectionMotionValue()` returns the active section and its scroll progress:

```tsx
import { useActiveSectionMotionValue } from '@react-scrollytelling/framer-motion';

const { trackingId, scrolledRatioMotionValue } = useActiveSectionMotionValue();
```

It also returns `trackingIdMotionValue` and `viewportBtmDistanceMotionValue`.
See [track grouped sections](https://hsunpei.github.io/react-scrollytelling/track_grouped_sections) for setting up the sections.

See the [documentation](https://hsunpei.github.io/react-scrollytelling/framer-motion) for an example.
