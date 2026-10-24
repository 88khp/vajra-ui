import { formatTime, timeFromDate, timeToDate } from './time-picker-utils';

describe('formatTime', () => {
  it('formats midnight as 12:00 AM', () => {
    expect(formatTime({ hour: 0, minute: 0 })).toBe('12:00 AM');
  });

  it('formats noon as 12:00 PM', () => {
    expect(formatTime({ hour: 12, minute: 0 })).toBe('12:00 PM');
  });

  it('formats an afternoon time with zero-padded minutes', () => {
    expect(formatTime({ hour: 14, minute: 5 })).toBe('2:05 PM');
  });

  it('formats a morning time', () => {
    expect(formatTime({ hour: 9, minute: 30 })).toBe('9:30 AM');
  });
});

describe('timeFromDate / timeToDate', () => {
  it('round-trips hour and minute through a Date', () => {
    const date = new Date(2026, 0, 1, 13, 45);
    const time = timeFromDate(date);

    expect(time).toEqual({ hour: 13, minute: 45 });

    const roundTripped = timeToDate(time, date);

    expect(roundTripped.getHours()).toBe(13);
    expect(roundTripped.getMinutes()).toBe(45);
  });

  it('preserves the base date while only changing time-of-day', () => {
    const base = new Date(2026, 5, 20);
    const result = timeToDate({ hour: 8, minute: 15 }, base);

    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(20);
    expect(result.getHours()).toBe(8);
    expect(result.getMinutes()).toBe(15);
  });
});
