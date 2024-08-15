import { useCallback, useState } from 'react';

import { useActiveSection } from '@react-scrollytelling/core';

const TEXT_COLOR = {
  RED: 'text-rose-500',
  ORANGE: 'text-orange-500',
  YELLOW: 'text-yellow-500',
  GREEN: 'text-green-500',
  BLUE: 'text-blue-500',
  PURPLE: 'text-purple-500',
};

export const ActiveSectionInfo = () => {
  const [trackingId, setTrackingId] = useState<string>('');
  const [scrolledRatio, setScrolledRatio] = useState<number>(0);

  const onActiveSectionChange = useCallback(
    ({ trackingId: id, scrolledRatio: ratio }: { trackingId: string; scrolledRatio: number }) => {
      setTrackingId(id);
      setScrolledRatio(ratio);
    },
    []
  );

  useActiveSection(onActiveSectionChange);

  return (
    <div className="mt-20">
      <ul className="list-disc text-xl leading-9 marker:text-slate-400">
        <li>
          You are viewing{' '}
          <span className="rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">
            <b className={TEXT_COLOR[trackingId]}>{trackingId}</b>
          </span>{' '}
          section
        </li>
        <li>
          Reading ratio: <b>{`${Math.round(scrolledRatio * 10000) / 10000}`}</b>
        </li>
      </ul>
    </div>
  );
};
