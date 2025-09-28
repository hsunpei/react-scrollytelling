import { useActiveSectionMotionValue } from '@react-scrollytelling/framer-motion';
import { motion, useTransform } from 'motion/react';

const TEXT_COLOR = {
  RED: 'text-rose-500',
  ORANGE: 'text-orange-500',
  YELLOW: 'text-yellow-500',
  GREEN: 'text-green-500',
  BLUE: 'text-blue-500',
  PURPLE: 'text-purple-500',
};

export const ActiveSectionInfoMotionValue = () => {
  const { trackingId, scrolledRatioMotionValue } = useActiveSectionMotionValue();

  // Transform the motion value to percentage width
  const widthPercentage = useTransform(
    scrolledRatioMotionValue,
    (val) => `${Math.round(val * 10000) / 100}%`
  );

  // Transform the motion value to display value
  const displayValue = useTransform(
    scrolledRatioMotionValue,
    (val) => `${Math.round(val * 10000) / 10000}`
  );

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="min-w-96 list-disc text-xl leading-9 marker:text-slate-400">
        <div>
          You are viewing{' '}
          <span className="rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">
            <b className={TEXT_COLOR[trackingId]}>{trackingId}</b>
          </span>{' '}
          section
          <br />
        </div>
        <div>
          <div className="w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="mt-2 min-w-20 rounded-full bg-blue-600  p-0.5 text-center text-xs font-medium leading-none text-blue-100"
              style={{
                width: widthPercentage,
              }}
            >
              <motion.b>{displayValue}</motion.b>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
