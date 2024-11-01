import { useActiveSectionSpring } from '@react-scrollytelling/react-spring';
import { animated } from '@react-spring/web';

const TEXT_COLOR = {
  RED: 'text-rose-500',
  ORANGE: 'text-orange-500',
  YELLOW: 'text-yellow-500',
  GREEN: 'text-green-500',
  BLUE: 'text-blue-500',
  PURPLE: 'text-purple-500',
};

export const ActiveSectionInfoSpring = () => {
  const { trackingId, scrolledRatioSpring } = useActiveSectionSpring();

  return (
    <div className="flex h-screen items-center justify-center">
      <ul className="list-disc text-xl leading-9 marker:text-slate-400">
        <small>
          Active Section = <b>{trackingId}</b>:
        </small>
        <li>
          You are viewing{' '}
          <span className="rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">
            <b className={TEXT_COLOR[trackingId]}>{trackingId}</b>
          </span>{' '}
          section
          <br />
        </li>
        <li>
          Reading ratio:
          <animated.b>
            {scrolledRatioSpring.to((val) => {
              return `${Math.round(val * 10000) / 10000}`;
            })}
          </animated.b>
        </li>
      </ul>
    </div>
  );
};
