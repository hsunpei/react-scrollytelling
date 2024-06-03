import { useCallback, useState } from 'react';

import { useActiveSection } from '@react-scrollytelling/core';

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
    <div>
      <h2>Active Section Info</h2>
      <p>Active Section Index: {trackingId}</p>
      <p>Active Section Progress: {scrolledRatio}</p>
    </div>
  );
};
