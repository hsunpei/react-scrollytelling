# Framer Motion Integration

import { TrackedSection } from '../src/components/TrackedSection';
import { ActiveSectionInfoMotionValue } from '../src/components/ActiveSectionInfoMotionValue';

import { ScrollytellingProvider } from '@react-scrollytelling/grouped';
import { StickyContainerTailwind } from '@react-scrollytelling/layout';

import { SectionScrollMotionValue } from '../src/components/SectionScrollMotionValue';

<div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg mb-4">
  <p className="text-blue-800 dark:text-blue-200 font-semibold">
    🎉 Tailwind v4 is now integrated! This blue box demonstrates Tailwind classes working with dark mode support.
  </p>
</div>

Using a state to do animations can be very expensive in terms of performance.

`motion` provides a way to control the styles/text without triggering re-renders.
By using the [MotionValue](https://motion.dev/motion/use-motion-value/) with [useTransform](https://motion.dev/motion/use-transform/) and motion elements, you can update the value without triggering re-renders.

react-scrollytelling provides a wrapper around `useSectionScroll()` to update the `MotionValue`, so you can animate the element based on the scroll progress.

## Example

### Single Section

You can use `useSectionScrollMotionValue()` which returned updated `MotionValue` - `scrolledRatioMotionValue` based on the scroll progress:

```tsx
import { useSectionScrollMotionValue } from '@react-scrollytelling/framer-motion';
import { motion, useTransform } from 'motion/react';

export const Section = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrolledRatioMotionValue } = useSectionScrollMotionValue(sectionRef);

  // Transform the motion value for opacity
  const opacity = useTransform(scrolledRatioMotionValue, (val) => 0.2 + 0.8 * val);

  // Transform the motion value for border width
  const borderWidth = useTransform(scrolledRatioMotionValue, (val) => `${Math.round(val * 6)}px`);

  return (
    <>
      {/* Use MotionValue with a motion element to change the styles */}
      <motion.section
        ref={sectionRef}
        style={{
          opacity,
          borderWidth,
        }}
      >
        {/* ... */}
      </motion.section>
    </>
  );
};
```

### Example

<SectionScrollMotionValue className="border-green-400 bg-green-200/20 dark:border-green-700 dark:bg-green-800/20" />

## Multiple Sections

### Example

You can simply the example in [track grouped sections](/docs/track-grouped-sections) and use `useActiveSectionMotionValue()` to get the active section information and the updated `MotionValue` based on the scroll progress:

```tsx
import { useActiveSectionMotionValue } from '@react-scrollytelling/framer-motion';

const { trackingId, scrolledRatioMotionValue } = useActiveSectionMotionValue();
```

<div className="mx-2 my-12">
  <ScrollytellingProvider>
    {/* Test class to verify Tailwind is working */}
    <div className="pb-10 -mt-10 hidden">Test</div>
    <StickyContainerTailwind
      overlay={
        <>
          <TrackedSection
            sectionID="RED"
            className="rounded-t-lg border-rose-400 bg-rose-200/20 pt-[50vh] dark:border-rose-700 dark:bg-rose-800/20"
          />
          <TrackedSection
            sectionID="ORANGE"
            className="-mt-[3px] border-orange-400 bg-orange-200/20 dark:border-orange-700 dark:bg-orange-800/20"
          />
          <TrackedSection
            sectionID="YELLOW"
            className="-mt-[3px] border-yellow-400 bg-yellow-200/20 dark:border-yellow-700 dark:bg-yellow-800/20"
          />
          <TrackedSection
            sectionID="GREEN"
            className="-mt-[3px] border-green-400 bg-green-200/20 dark:border-green-700 dark:bg-green-800/20"
          />
          <TrackedSection
            sectionID="BLUE"
            className="-mt-[3px] border-blue-400 bg-blue-200/20 dark:border-blue-700 dark:bg-blue-800/20"
          />
          <TrackedSection
            sectionID="PURPLE"
            className="-mt-[3px] rounded-b-lg border-purple-400 bg-purple-200/20 pt-[10vh] dark:border-purple-700 dark:bg-purple-800/20"
          />
        </>
      }
    >
      {/* Background */}
      <ActiveSectionInfoMotionValue />
    </StickyContainerTailwind>
  </ScrollytellingProvider>
</div>
