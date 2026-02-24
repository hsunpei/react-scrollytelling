import { useCallback, useState } from 'react';
import { useActiveSection } from '@react-scrollytelling/grouped';

const TEXT_COLOR: Record<string, string> = {
  RED: 'text-red',
  ORANGE: 'text-orange',
  YELLOW: 'text-yellow',
  GREEN: 'text-green',
  BLUE: 'text-blue',
  PURPLE: 'text-purple',
};

export const ActiveSectionInfo = () => {
  const [trackingId, setTrackingId] = useState<string>('');
  const [scrolledRatio, setScrolledRatio] = useState<number>(0);

  const onActiveSectionChange = useCallback(
    ({ trackingId: id, scrolledRatio: ratio }: { trackingId: string; scrolledRatio: number }) => {
      setTrackingId(id);
      setScrolledRatio(ratio);
    },
    [],
  );

  useActiveSection(onActiveSectionChange);

  return (
    <div className="active-info">
      <ul>
        <small>
          Active Section = <b data-testid="active-section-id">{trackingId}</b>:
        </small>
        <li>
          You are viewing{' '}
          <b className={TEXT_COLOR[trackingId]} data-testid="active-section-label">
            {trackingId}
          </b>{' '}
          section
        </li>
        <li>
          Reading ratio:{' '}
          <b data-testid="active-section-ratio">{`${Math.round(scrolledRatio * 10000) / 10000}`}</b>
        </li>
      </ul>
    </div>
  );
};
