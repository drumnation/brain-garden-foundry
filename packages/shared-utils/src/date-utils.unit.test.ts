import {describe, expect, it} from 'vitest';
import {
  addDays,
  daysBetween,
  endOfDay,
  formatDate,
  isWeekend,
  parseDate,
  startOfDay,
} from './date-utils';

describe('date-utils', () => {
  describe('formatDate', () => {
    it('formats date to YYYY-MM-DD', () => {
      const date = new Date('2025-10-22T15:30:00Z');
      expect(formatDate(date)).toBe('2025-10-22');
    });

    it('handles different months correctly', () => {
      const jan = new Date('2025-01-15');
      const dec = new Date('2025-12-25');

      expect(formatDate(jan)).toBe('2025-01-15');
      expect(formatDate(dec)).toBe('2025-12-25');
    });

    it('pads single digit days and months', () => {
      const date = new Date('2025-01-05');
      expect(formatDate(date)).toBe('2025-01-05');
    });
  });

  describe('parseDate', () => {
    it('parses valid date string', () => {
      const result = parseDate('2025-10-22');
      expect(result).toBeInstanceOf(Date);
      expect(formatDate(result)).toBe('2025-10-22');
    });

    it('throws error for invalid format', () => {
      expect(() => parseDate('10/22/2025')).toThrow('Invalid date format');
      expect(() => parseDate('2025-13-01')).toThrow('Invalid date');
      expect(() => parseDate('not-a-date')).toThrow('Invalid date format');
    });

    it('throws error for empty string', () => {
      expect(() => parseDate('')).toThrow('Invalid date format');
    });

    it('throws error for invalid date values', () => {
      expect(() => parseDate('2025-02-30')).toThrow('Invalid date');
    });
  });

  describe('addDays', () => {
    it('adds positive days', () => {
      const date = new Date('2025-10-22');
      const result = addDays(date, 7);

      expect(formatDate(result)).toBe('2025-10-29');
    });

    it('subtracts days when negative', () => {
      const date = new Date('2025-10-22');
      const result = addDays(date, -5);

      expect(formatDate(result)).toBe('2025-10-17');
    });

    it('handles month boundaries', () => {
      const date = new Date('2025-10-30');
      const result = addDays(date, 5);

      expect(formatDate(result)).toBe('2025-11-04');
    });

    it('handles year boundaries', () => {
      const date = new Date('2025-12-30');
      const result = addDays(date, 5);

      expect(formatDate(result)).toBe('2026-01-04');
    });

    it('does not mutate original date', () => {
      const original = new Date('2025-10-22');
      const originalTime = original.getTime();

      addDays(original, 7);

      expect(original.getTime()).toBe(originalTime);
    });
  });

  describe('isWeekend', () => {
    it('returns true for Saturday', () => {
      const saturday = new Date('2025-10-25'); // Saturday
      expect(isWeekend(saturday)).toBe(true);
    });

    it('returns true for Sunday', () => {
      const sunday = new Date('2025-10-26'); // Sunday
      expect(isWeekend(sunday)).toBe(true);
    });

    it('returns false for weekdays', () => {
      const monday = new Date('2025-10-20');
      const wednesday = new Date('2025-10-22');
      const friday = new Date('2025-10-24');

      expect(isWeekend(monday)).toBe(false);
      expect(isWeekend(wednesday)).toBe(false);
      expect(isWeekend(friday)).toBe(false);
    });
  });

  describe('startOfDay', () => {
    it('sets time to 00:00:00.000', () => {
      const date = new Date('2025-10-22T15:30:45.500Z');
      const result = startOfDay(date);

      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('preserves the date', () => {
      const date = new Date('2025-10-22T15:30:00Z');
      const result = startOfDay(date);

      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(9); // October is month 9 (0-indexed)
      expect(result.getDate()).toBe(22);
    });

    it('does not mutate original date', () => {
      const original = new Date('2025-10-22T15:30:00Z');
      const originalTime = original.getTime();

      startOfDay(original);

      expect(original.getTime()).toBe(originalTime);
    });
  });

  describe('endOfDay', () => {
    it('sets time to 23:59:59.999', () => {
      const date = new Date('2025-10-22T10:00:00.000Z');
      const result = endOfDay(date);

      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });

    it('preserves the date', () => {
      const date = new Date('2025-10-22T10:00:00Z');
      const result = endOfDay(date);

      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(9); // October
      expect(result.getDate()).toBe(22);
    });

    it('does not mutate original date', () => {
      const original = new Date('2025-10-22T10:00:00Z');
      const originalTime = original.getTime();

      endOfDay(original);

      expect(original.getTime()).toBe(originalTime);
    });
  });

  describe('daysBetween', () => {
    it('calculates days between dates', () => {
      const start = new Date('2025-10-22');
      const end = new Date('2025-10-29');

      expect(daysBetween(start, end)).toBe(7);
    });

    it('returns absolute difference', () => {
      const date1 = new Date('2025-10-22');
      const date2 = new Date('2025-10-15');

      expect(daysBetween(date1, date2)).toBe(7);
      expect(daysBetween(date2, date1)).toBe(7);
    });

    it('returns 0 for same date', () => {
      const date = new Date('2025-10-22');

      expect(daysBetween(date, date)).toBe(0);
    });

    it('handles month boundaries', () => {
      const start = new Date('2025-10-30');
      const end = new Date('2025-11-05');

      expect(daysBetween(start, end)).toBe(6);
    });

    it('handles year boundaries', () => {
      const start = new Date('2025-12-30');
      const end = new Date('2026-01-05');

      expect(daysBetween(start, end)).toBe(6);
    });
  });
});
