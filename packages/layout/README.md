# @react-scrollytelling/layout

Sticky container layouts for scrollytelling.

## Installation

```bash
npm install @react-scrollytelling/layout
```

## Usage

`StickyContainer` keeps the background sticky while the overlay content scrolls over it:

```tsx
import { StickyContainer } from '@react-scrollytelling/layout';

<StickyContainer
  overlay={
    <>
      {/* Put foreground sections here */}
    </>
  }
>
  {/* Put sticky background here */}
  <StickyBackground />
</StickyContainer>;
```

If you are using Tailwind CSS, you can use `StickyContainerTailwind` instead.
Remember to add the library as a source so the classes can be applied:

```css
@import "tailwindcss";
@source "../node_modules/@react-scrollytelling/layout";
```

The path is relative to your CSS file. For Tailwind CSS v3, add the path to `content` in `tailwind.config.js` instead.

## Props

Both components accept the same props:

- `children`: The sticky background.
- `overlay`: The content that scrolls over the background.
- `backgroundRef`: Ref to the background container.
- `className`: Class name of the outer container.
- `overlayClassName`: Class name of the overlay.
- `viewportUnit`: Viewport unit the sticky range is measured in: `vh`, `svh`, `dvh` or `lvh`. Default value: `vh`.
  Use `svh` to keep the scroll length fixed while a mobile browser collapses its toolbars.
- `backgroundUnit`: Viewport unit for the height of the background. Default value: same as `viewportUnit`.
  Use `dvh` for a full-bleed background, so it still reaches the bottom edge when the toolbars are hidden.

## Hooks

- `useResizeObserver(ref)`: The `{ width, height }` of the element, updated when it is resized.

See the [documentation](https://hsunpei.github.io/react-scrollytelling/track_grouped_sections#note) for an example.
