import { useActiveSectionMotionValue } from '@react-scrollytelling/framer-motion';
import { motion, useTransform } from 'motion/react';

const TEXT_COLOR: Record<string, string> = {
  RED: 'text-red',
  ORANGE: 'text-orange',
  YELLOW: 'text-yellow',
  GREEN: 'text-green',
  BLUE: 'text-blue',
  PURPLE: 'text-purple',
};

export const ActiveSectionInfo = () => {
  const { trackingId, scrolledRatioMotionValue } = useActiveSectionMotionValue();

  // Transform the motion value to percentage width
  const widthPercentage = useTransform(
    scrolledRatioMotionValue,
    (val: number) => `${Math.round(val * 10000) / 100}%`
  );

  // Transform the motion value to display value
  const displayValue = useTransform(
    scrolledRatioMotionValue,
    (val: number) => `${Math.round(val * 10000) / 10000}`
  );

  return (
    <div className="active-info">
      <div style={{ minWidth: '24rem', fontSize: '1.25rem', lineHeight: '2.25rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <small>
            Active Section = <b data-testid="active-section-id">{trackingId}</b>:
          </small>
        </div>
        <div>
          You are viewing{' '}
          <span style={{ backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', color: '#0f172a' }}>
            <b className={trackingId ? TEXT_COLOR[trackingId] : ''} data-testid="active-section-label">
              {trackingId}
            </b>
          </span>{' '}
          section
          <br />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <div style={{ width: '100%', borderRadius: '9999px', backgroundColor: '#e5e7eb' }}>
            <motion.div
              style={{
                width: widthPercentage,
                minWidth: '5rem',
                borderRadius: '9999px',
                backgroundColor: '#2563eb',
                padding: '0.125rem',
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 500,
                lineHeight: 1,
                color: '#dbeafe'
              }}
            >
              <motion.b data-testid="active-section-ratio">{displayValue}</motion.b>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
