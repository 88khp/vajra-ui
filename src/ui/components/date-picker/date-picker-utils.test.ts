import {
  addMonths,
  formatDate,
  getCalendarGrid,
  isAfterDay,
  isBeforeDay,
  isSameDay,
  isSameMonth,
} from './date-picker-utils';

describe('isSameDay', () => {
  it('returns true for the same calendar day regardless of time', () => {
    expect(isSameDay(new Date(2026, 0, 15, 9, 0), new Date(2026, 0, 15, 23, 59))).toBe(true);
  });

  it('returns false for different days', () => {
    expect(isSameDay(new Date(2026, 0, 15), new Date(2026, 0, 16))).toBe(false);
  });
});

describe('isSameMonth', () => {
  it('returns true for dates in the same month and year', () => {
    expect(isSameMonth(new Date(2026, 2, 1), new Date(2026, 2, 28))).toBe(true);
  });

  it('returns false across a year boundary even if the month number matches', () => {
    expect(isSameMonth(new Date(2025, 2, 1), new Date(2026, 2, 1))).toBe(false);
  });
});

describe('addMonths', () => {
  it('advances the month and clamps to the 1st to avoid day-overflow rollover', () => {
    const next = addMonths(new Date(2026, 0, 31), 1);

    expect(next.getMonth()).toBe(1);
    expect(next.getDate()).toBe(1);
  });

  it('rolls over into the next year', () => {
    const next = addMonths(new Date(2026, 11, 1), 1);

    expect(next.getFullYear()).toBe(2027);
    expect(next.getMonth()).toBe(0);
  });
});

describe('isBeforeDay / isAfterDay', () => {
  it('compares calendar days ignoring time-of-day', () => {
    const morning = new Date(2026, 0, 10, 1, 0);
    const evening = new Date(2026, 0, 11, 23, 0);

    expect(isBeforeDay(morning, evening)).toBe(true);
    expect(isAfterDay(evening, morning)).toBe(true);
    expect(isBeforeDay(morning, morning)).toBe(false);
  });
});

describe('getCalendarGrid', () => {
  it('always returns 42 cells (6 full weeks)', () => {
    expect(getCalendarGrid(new Date(2026, 1, 1))).toHaveLength(42);
  });

  it('marks cells outside the target month as not current-month', () => {
    const grid = getCalendarGrid(new Date(2026, 1, 1)); // Feb 2026 starts on a Sunday
    const inMonthCount = grid.filter(cell => cell.isCurrentMonth).length;

    expect(inMonthCount).toBe(28);
  });

  it('starts the grid on a Sunday', () => {
    const grid = getCalendarGrid(new Date(2026, 5, 1));

    expect(grid[0].date.getDay()).toBe(0);
  });
});

describe('formatDate', () => {
  it('formats as "Mon D, YYYY"', () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe('Jan 5, 2026');
  });
});
