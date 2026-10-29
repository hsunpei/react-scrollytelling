/**
 * Viewport units for the sticky range and the background height.
 * On mobile, `vh` is the height when the browser toolbars are hidden,
 * and `svh` is the height when they are shown.
 */
export type ViewportUnit = "vh" | "svh" | "dvh" | "lvh";

/**
 * Tailwind CSS height class of each unit.
 * The full class names are needed so Tailwind CSS can find them in the source.
 */
export const BACKGROUND_HEIGHT_CLASS: Record<ViewportUnit, string> = {
  vh: "h-screen",
  svh: "h-svh",
  dvh: "h-dvh",
  lvh: "h-lvh",
};
