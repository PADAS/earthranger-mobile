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
