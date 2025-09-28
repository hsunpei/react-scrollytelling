import { useRef } from 'react';

import { useTrail, animated } from '@react-spring/web';

interface AnimatedTrailProps {
  isIntersecting: boolean;
  title: string;
  className?: string;
  trackOnce?: boolean;
}

export const AnimatedTrail = ({ isIntersecting, className, title }: AnimatedTrailProps) => {
  const items = title.split(' ');
  const containerRef = useRef(null);
  const trail = useTrail(items.length, {
    opacity: isIntersecting ? 1 : 0,
    x: isIntersecting ? 0 : 200,
  });

  return (
    <div ref={containerRef}>
      {trail.map(({ opacity, x }, idx) => {
        const text = items[idx];

        return (
          <animated.span
            key={`${idx}-${text}`}
            className={`block text-8xl ${className}`}
            style={{
              opacity,
              transform: x.to((pos) => `translate3d(0,${pos}%,0)`),
            }}
          >
            {text}
          </animated.span>
        );
      })}
    </div>
  );
};
