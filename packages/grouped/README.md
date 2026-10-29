# @react-scrollytelling/grouped

Multi-section tracking with active section detection.

## Installation

```bash
npm install @react-scrollytelling/grouped @react-scrollytelling/core
```

## Usage

### 1. Set up sections to track

For each section you want to track, assign it with a ref and name it with a unique `sectionID`:

```tsx
import { useRef } from 'react';
import { useTrackedSectionScroll } from '@react-scrollytelling/grouped';

export const TrackedSection = ({ sectionID }: { sectionID: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useTrackedSectionScroll(sectionRef, sectionID);

  return <section ref={sectionRef}>{/* ... */}</section>;
};
```

`useTrackedSectionScroll` also accepts an `onScroll` callback, which is called with the scroll progress of the section while it is the active section.

### 2. Wrap the sections with `ScrollytellingProvider`

```tsx
import { ScrollytellingProvider } from '@react-scrollytelling/grouped';

<ScrollytellingProvider>
  <TrackedSection sectionID="RED" />
  <TrackedSection sectionID="ORANGE" />
</ScrollytellingProvider>;
```

It is recommended to wrap the sections with one `ScrollytellingProvider` at the page level,
because `ScrollytellingProvider` is listening to the window scroll events.

### 3. Subscribe to the active section

```tsx
import { useCallback } from 'react';
import { type ActiveSectionScrollInfo, useActiveSection } from '@react-scrollytelling/grouped';

const onActiveSectionChange = useCallback(
  ({ trackingId, scrolledRatio }: ActiveSectionScrollInfo) => {
    // ...
  },
  []
);

useActiveSection(onActiveSectionChange);
```

The active section is the one closest to the bottom of the viewport.
The callback receives its `trackingId` and `scrolledRatio` as the page scrolls, and needs to be memoized.

See the [documentation](https://hsunpei.github.io/react-scrollytelling/track_grouped_sections) for more details.
