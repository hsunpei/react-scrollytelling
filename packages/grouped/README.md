# @react-scrollytelling/grouped

Multi-section tracking with active section detection.

## Installation

```bash
npm install @react-scrollytelling/grouped @react-scrollytelling/core
```

## Usage

### 1. Set up sections to track

For each section you want to track, assign it with a ref and name it with a unique `sectionID`.
Then, use the `useTrackedSectionScroll` hook to track the active section based on the sectionID.

```tsx
import { useRef } from 'react';
import { useTrackedSectionScroll } from '@react-scrollytelling/grouped';

export const TrackedSection = ({ sectionID }: { sectionID: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useTrackedSectionScroll(sectionRef, sectionID);

  return <section ref={sectionRef}>{/* ... */}</section>;
};
```

You can also pass an `onScroll` callback to `useTrackedSectionScroll` to get the scroll progress of the section when it is active.

### 2. Wrap the sections with `ScrollytellingProvider`

```tsx
import { ScrollytellingProvider } from '@react-scrollytelling/grouped';

<ScrollytellingProvider>
  <TrackedSection sectionID="RED" />
  <TrackedSection sectionID="ORANGE" />
</ScrollytellingProvider>;
```

It is recommended to wrap the sections with one `ScrollytellingProvider` at the page level
because `ScrollytellingProvider` is listening to the window scroll events.

### 3. Subscribe to the active section changes

To get the active section information, use the `useActiveSection()` hook.

```tsx
import { useCallback, useState } from 'react';
import { useActiveSection } from '@react-scrollytelling/grouped';

export const ActiveSectionInfo = () => {
  const [trackingId, setTrackingId] = useState<string>('');
  const [scrolledRatio, setScrolledRatio] = useState<number>(0);

  const onActiveSectionChange = useCallback(
    ({ trackingId: id, scrolledRatio: ratio }: { trackingId: string; scrolledRatio: number }) => {
      setTrackingId(id);
      setScrolledRatio(ratio);
    },
    []
  );

  useActiveSection(onActiveSectionChange);

  return (
    <p>
      You are viewing {trackingId}, reading ratio: {scrolledRatio}
    </p>
  );
};
```

Note that the state changes in the callback function will trigger re-renders which add performance overheads to your animations.
You can use `@react-scrollytelling/react-spring` or `@react-scrollytelling/framer-motion` to avoid triggering re-renders.

Documentation: [Track Grouped Sections](https://hsunpei.github.io/react-scrollytelling/track_grouped_sections)
