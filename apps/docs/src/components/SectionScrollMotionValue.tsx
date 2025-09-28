import { useRef } from 'react';

import { useSectionScrollMotionValue } from '@react-scrollytelling/framer-motion';
import { motion, useTransform } from 'motion/react';

export const SectionScrollMotionValue = ({ className }: { className: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrolledRatioMotionValue } = useSectionScrollMotionValue(sectionRef);

  // Transform the motion value for opacity
  const opacity = useTransform(scrolledRatioMotionValue, (val) => 0.2 + 0.8 * val);

  // Transform the motion value for border width
  const borderWidth = useTransform(scrolledRatioMotionValue, (val) => `${Math.round(val * 6)}px`);

  // Transform the motion value for display
  const displayValue = useTransform(
    scrolledRatioMotionValue,
    (val) => `${Math.round(val * 10000) / 10000}`
  );

  return (
    <div className="mx-2 my-12">
      <motion.section
        ref={sectionRef}
        style={{
          opacity,
          borderWidth,
        }}
        className={`flex h-96 flex-col items-center rounded-lg p-10 drop-shadow-2xl ${className}`}
      >
        <ul className="list-disc text-lg marker:text-slate-400">
          <li>
            scrolledRatio: <motion.span>{displayValue}</motion.span>
          </li>
        </ul>
      </motion.section>
    </div>
  );
};
