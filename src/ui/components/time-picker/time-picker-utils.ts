export type TTimeValue = { hour: number; minute: number };

const pad2 = (n: number): string => String(n).padStart(2, '0');

export const formatTime = ({ hour, minute }: TTimeValue): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${hour12}:${pad2(minute)} ${period}`;
};

export const timeFromDate = (date: Date): TTimeValue => ({
  hour: date.getHours(),
  minute: date.getMinutes(),
});

export const timeToDate = (time: TTimeValue, base: Date = new Date()): Date => {
  const next = new Date(base);

  next.setHours(time.hour, time.minute, 0, 0);

  return next;
};
