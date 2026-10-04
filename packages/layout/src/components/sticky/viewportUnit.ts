/**
 * Which viewport unit a sticky range is measured in.
 *
 * On a phone, `vh` resolves to the *large* viewport — the height with the
 * browser's toolbars hidden. They collapse and expand as you scroll, so a
 * layout built on `vh` changes height mid-gesture and every offset below it
 * moves. `svh` is the small viewport, the height with the toolbars shown, and
 * it does not change while they animate.
 *
 * `vh` is the default so existing layouts are untouched. Pass `svh` for a
 * scroll length that stays put in a mobile or in-app browser.
 */
export type ViewportUnit = "vh" | "svh" | "dvh" | "lvh";

/**
 * Tailwind height classes per unit.
 *
 * A lookup rather than an interpolated class name: Tailwind extracts classes
 * from source text, so `h-${unit}` would compile to nothing.
 */
export const BACKGROUND_HEIGHT_CLASS: Record<ViewportUnit, string> = {
  vh: "h-screen",
  svh: "h-svh",
  dvh: "h-dvh",
  lvh: "h-lvh",
};
