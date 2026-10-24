export const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isSameMonth = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export const startOfDay = (date: Date): Date => {
  const next = new Date(date);

  next.setHours(0, 0, 0, 0);

  return next;
};

export const addMonths = (date: Date, amount: number): Date => {
  const next = new Date(date);

  next.setDate(1);
  next.setMonth(next.getMonth() + amount);

  return next;
};

export const isBeforeDay = (a: Date, b: Date): boolean =>
  startOfDay(a).getTime() < startOfDay(b).getTime();
export const isAfterDay = (a: Date, b: Date): boolean =>
  startOfDay(a).getTime() > startOfDay(b).getTime();

export type TCalendarCell = {
  date: Date;
  isCurrentMonth: boolean;
};

// 6 full weeks (42 cells), starting from the Sunday on/before the 1st of the
// month, so the grid is always a stable, non-reflowing 6-row shape.
export const getCalendarGrid = (monthDate: Date): TCalendarCell[] => {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(firstOfMonth);

  gridStart.setDate(gridStart.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);

    date.setDate(gridStart.getDate() + i);

    return { date, isCurrentMonth: date.getMonth() === monthDate.getMonth() };
  });
};

export const formatDate = (date: Date): string =>
  `${MONTH_LABELS[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;
