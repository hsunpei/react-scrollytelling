# @react-scrollytelling/layout

Sticky container layouts for scrollytelling.

## Installation

```bash
npm install @react-scrollytelling/layout
```

## Usage

To show the sticky background effect with a series of sections on its top, you can use `StickyContainer`:

```tsx
import { StickyContainer } from "@react-scrollytelling/layout";

<StickyContainer overlay={<>{/* Put foreground sections here */}</>}>
  {/* Put sticky background here */}
  <StickyBackground />
</StickyContainer>;
```

If you want to use the Tailwind CSS utility classes to style the sticky container, you can use `StickyContainerTailwind` instead of `StickyContainer`.
In your CSS file, remember to add `@react-scrollytelling/layout` as a source so the classes can be applied:

```css
@import "tailwindcss";

/* path to the library */
@source "../node_modules/@react-scrollytelling/layout";
```

For Tailwind CSS v3, add `./node_modules/@react-scrollytelling/layout/dist/**/*.{js,mjs}` to `content` in `tailwind.config.js`.

## Props

Both components accept the same props:

- `children`: The sticky background.
- `overlay`: The foreground content.
- `backgroundRef`: A ref to the background container.
- `className`: The class name of the outer container.
- `overlayClassName`: The class name of the overlay.
- `viewportUnit`: The viewport unit of the sticky range: `vh`, `svh`, `dvh` or `lvh`. Default value: `vh`. You can use `svh` to keep the scroll length the same when the browser toolbars collapse on mobile.
- `backgroundUnit`: The viewport unit of the background height. Default value: `viewportUnit`. You can use `dvh` for a full-screen background.

## Hooks

- `useResizeObserver()`: Get the width and height of an element when it is resized.

Documentation: [Track Grouped Sections](https://hsunpei.github.io/react-scrollytelling/track_grouped_sections#note)
