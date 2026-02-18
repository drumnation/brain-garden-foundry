/**
 * Date utility functions for formatting and manipulating dates.
 *
 * All functions are pure with no side effects.
 */

/**
 * Formats a date to YYYY-MM-DD format
 *
 * @param date - The date to format
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date('2025-10-22')) // '2025-10-22'
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

/**
 * Parses a date string in YYYY-MM-DD format
 *
 * @param dateString - Date string to parse
 * @returns Parsed Date object
 * @throws Error if date string is invalid
 *
 * @example
 * parseDate('2025-10-22') // Date object for 2025-10-22
 */
export function parseDate(dateString: string): Date {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  return date;
}

/**
 * Adds specified number of days to a date
 *
 * @param date - The starting date
 * @param days - Number of days to add (can be negative)
 * @returns New date with days added
 *
 * @example
 * const today = new Date('2025-10-22');
 * addDays(today, 7) // Date for 2025-10-29
 * addDays(today, -1) // Date for 2025-10-21
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Checks if a date falls on a weekend (Saturday or Sunday)
 *
 * @param date - The date to check
 * @returns true if the date is a weekend, false otherwise
 *
 * @example
 * isWeekend(new Date('2025-10-25')) // true (Saturday)
 * isWeekend(new Date('2025-10-22')) // false (Wednesday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

/**
 * Gets the start of day (00:00:00.000) for a given date
 *
 * @param date - The date to process
 * @returns New date at start of day
 *
 * @example
 * const now = new Date('2025-10-22T15:30:00');
 * startOfDay(now) // 2025-10-22T00:00:00.000
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Gets the end of day (23:59:59.999) for a given date
 *
 * @param date - The date to process
 * @returns New date at end of day
 *
 * @example
 * const now = new Date('2025-10-22T15:30:00');
 * endOfDay(now) // 2025-10-22T23:59:59.999
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Calculates the difference in days between two dates
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days between dates (absolute value)
 *
 * @example
 * const start = new Date('2025-10-22');
 * const end = new Date('2025-10-29');
 * daysBetween(start, end) // 7
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.round(diffTime / oneDay);
}
