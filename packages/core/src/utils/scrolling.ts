/**
 * Returns the current window `scrollTop`, `windowHeight` (height of the window),
 * and the `scrollBottom` (`scrollTop` + `windowHeight`)
 */
export function getScrollPosition() {
  // detect window object to prevent issues in SSR
  if (typeof window === 'undefined') {
    return {
      scrollTop: 0,
      scrollBottom: 0,
      windowHeight: 10,
    };
  }

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.outerHeight || document.documentElement.clientHeight;
  const scrollBottom = scrollTop + windowHeight;

  return {
    scrollTop,
    scrollBottom,
    windowHeight,
  };
}

export function getCappedScrolledRatio(ratio: number) {
  if (ratio < 0) {
    return 0;
  }
  if (ratio > 1) {
    return 1;
  }
  return ratio;
}
