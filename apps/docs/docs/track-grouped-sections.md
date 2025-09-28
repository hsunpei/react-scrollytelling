# Track Grouped Sections

To tell a story that spans multiple sections, for example, changing the background based on the section in view,
multiple sections tracking tools of `react-scrollytelling` can help you achieve this.

Instead of tracking every section individually and listening to window scroll events in each section, `react-scrollytelling`
only tracks the sections that are viewport to minimize the performance impact.

## Building a scrollytelling story with multiple sections

Here are some key concepts to keep in mind when building a scrollytelling story with multiple sections:

### Active section

When there are multiple sections in the viewport, the effects to show should be based on the section that the user is currently viewing.

We call the section the user is currently viewing the "active section", and it the section that has just been scrolled into view.
Therefore, the active section is the section that is closest to the bottom of the viewport.

### Scroll progress

For the reading/scroll progress of the active section, it is defined as `the height above the bottom of the viewport` divided by `the height of the active section`.

## Start tracking the active section

### 1. Set up sections to track

For each section you want to track, assign it with a ref and name it with a unique `sectionID`.
Then, use the `useTrackedSectionScroll` hook to track the active section based on the sectionID.

```tsx
import { useTrackedSectionScroll } from '@react-scrollytelling/grouped';

export const TrackedSection = ({ sectionID }: { sectionID: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  useTrackedSectionScroll(sectionRef, sectionID);

  return (
    <section ref={sectionRef} className="h-[100vh] border-4 border-dashed p-4">
      <h1>Section {sectionID}</h1>
    </section>
  );
};
```

### 2. Wrap with `ScrollytellingProvider`

Wrap your sections with `ScrollytellingProvider` to enable context for tracking.

```tsx
import { ScrollytellingProvider } from '@react-scrollytelling/grouped';

export const MyScrollytelling = () => {
  return <ScrollytellingProvider>{/* Your tracked sections here */}</ScrollytellingProvider>;
};
```

### 3. Use `useActiveSectionScrollState` to get active section info

Inside any child component of `ScrollytellingProvider`, you can use `useActiveSectionScrollState()` to get the active section information:

```tsx
import { useActiveSectionScrollState } from '@react-scrollytelling/grouped';

export const ActiveSectionInfo = () => {
  const { trackingId, scrolledRatio } = useActiveSectionScrollState();

  return (
    <div>
      You are viewing {trackingId} section. Scrolled: {scrolledRatio}
    </div>
  );
};
```

## Example

```tsx
import { ScrollytellingProvider } from '@react-scrollytelling/grouped';
import { StickyContainerTailwind } from '@react-scrollytelling/layout';

export const MultipleSectionsExample = () => {
  return (
    <ScrollytellingProvider>
      <StickyContainerTailwind
        overlay={
          <>
            <TrackedSection
              sectionID="RED"
              className="rounded-t-lg border-rose-400 bg-rose-200 pt-[50vh] dark:border-rose-700 dark:bg-rose-800"
            />
            <TrackedSection
              sectionID="ORANGE"
              className="-mt-[3px] border-orange-400 bg-orange-200 dark:border-orange-700 dark:bg-orange-800"
            />
            <TrackedSection
              sectionID="YELLOW"
              className="-mt-[3px] border-yellow-400 bg-yellow-200 dark:border-yellow-700 dark:bg-yellow-800"
            />
            <TrackedSection
              sectionID="GREEN"
              className="-mt-[3px] border-green-400 bg-green-200 dark:border-green-700 dark:bg-green-800"
            />
            <TrackedSection
              sectionID="BLUE"
              className="-mt-[3px] border-blue-400 bg-blue-200 dark:border-blue-700 dark:bg-blue-800"
            />
            <TrackedSection
              sectionID="PURPLE"
              className="-mt-[3px] rounded-b-lg border-purple-400 bg-purple-200 pt-[10vh] dark:border-purple-700 dark:bg-purple-800"
            />
          </>
        }
      >
        {/* Background */}
        <ActiveSectionInfo />
      </StickyContainerTailwind>
    </ScrollytellingProvider>
  );
};
```

## Best Practices

1. **Use unique section IDs**: Each section should have a unique identifier
2. **Optimize performance**: The provider automatically handles cleanup when components unmount
3. **Use appropriate thresholds**: Adjust intersection observer options for your use case
4. **Clean up**: The provider automatically handles cleanup when components unmount
