/** The scrolled value is not originally capped as 0~1 in useSectionScroll */
export function getScrolledRatio(ratio: number) {
  if (ratio < 0) {
    return 0;
  }
  if (ratio > 1) {
    return 1;
  }
  return ratio;
}
