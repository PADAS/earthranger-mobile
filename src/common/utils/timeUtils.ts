// External Dependencies
import dayjs from 'dayjs';

export const getTimeDiff = (startTime: number) => {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  let diff = Math.abs(now - start);

  const days = Math.floor(diff / 1000 / 60 / 60 / 24);
  diff -= days * 1000 * 60 * 60 * 24;

  const hours = Math.floor(diff / 1000 / 60 / 60);
  diff -= hours * 1000 * 60 * 60;

  const mins = Math.floor(diff / 1000 / 60);

  return {
    days,
    hours,
    mins,
  };
};

export const calculateDateDifference = (updatedAt: string | null, t: any): string => {
  if (!updatedAt) return '';

  const now = dayjs();
  const updated = dayjs(updatedAt);

  const timeUnits = [
    { unit: 'days', threshold: 24 * 60 * 60 },
    { unit: 'hours', threshold: 60 * 60 },
    { unit: 'minutes', threshold: 60 },
    { unit: 'seconds', threshold: 0 },
  ] as const;

  // eslint-disable-next-line no-restricted-syntax
  for (const { unit, threshold } of timeUnits) {
    const diff = now.diff(updated, 'seconds');
    if (diff >= threshold) {
      const calcDiff = now.diff(updated, unit);
      return formatTimeDifference(unit, calcDiff, t);
    }
  }

  return '';
};

const formatTimeDifference = (
  unit: 'days' | 'hours' | 'minutes' | 'seconds',
  diff: number,
  t: any,
): string => {
  const key = diff > 1 ? `${unit}Ago` : `${unit.slice(0, -1)}Ago`;
  return t(`subjectsView.timeDifference.${key}`, { diff });
};
