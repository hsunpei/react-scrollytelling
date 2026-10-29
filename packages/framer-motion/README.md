# @react-scrollytelling/framer-motion

Framer Motion integration.

Using a state to do animations can be very expensive in terms of performance.

`motion` provides a way to control the styles/text without triggering re-renders.
By using the [MotionValue](https://motion.dev/docs/react-motion-value) with [useTransform](https://motion.dev/docs/react-use-transform) and motion elements, you can update the value without triggering re-renders.

react-scrollytelling provides wrappers around `useSectionScroll()` and `useActiveSection()` to update the `MotionValue`, so you can animate the element based on the scroll progress.

## Installation

```bash
npm install @react-scrollytelling/framer-motion @react-scrollytelling/core @react-scrollytelling/grouped motion
```

## Usage

### Single section

You can use `useSectionScrollMotionValue()` which returns `scrolledRatioMotionValue` updated based on the scroll progress:

```tsx
import { useRef } from "react";
import { useSectionScrollMotionValue } from "@react-scrollytelling/framer-motion";
import { motion, useTransform } from "motion/react";

export const Section = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrolledRatioMotionValue } = useSectionScrollMotionValue(sectionRef);

  const opacity = useTransform(
    scrolledRatioMotionValue,
    (val) => 0.2 + 0.8 * val
  );
  const borderWidth = useTransform(
    scrolledRatioMotionValue,
    (val) => `${Math.round(val * 6)}px`
  );

  return (
    <motion.section ref={sectionRef} style={{ opacity, borderWidth }}>
      {/* ... */}
    </motion.section>
  );
};
```

### Multiple sections

You can follow the example in [track grouped sections](https://hsunpei.github.io/react-scrollytelling/track_grouped_sections) and use `useActiveSectionMotionValue()` to get the active section information and the updated `MotionValue` based on the scroll progress:

```tsx
import { useActiveSectionMotionValue } from "@react-scrollytelling/framer-motion";

const {
  trackingId,
  trackingIdMotionValue,
  scrolledRatioMotionValue,
  viewportBtmDistanceMotionValue,
} = useActiveSectionMotionValue();
```

Documentation: [Framer Motion Integration](https://hsunpei.github.io/react-scrollytelling/framer-motion)
