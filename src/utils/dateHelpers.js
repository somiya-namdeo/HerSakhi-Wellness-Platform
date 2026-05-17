/**
 * src/utils/dateHelpers.js
 * -------------------------
 * Shared date utilities used across Dashboard and Period Tracker pages.
 * Ensures consistent calculation and display of prediction dates everywhere.
 */

/**
 * Calculate the number of days from today until a given date string.
 * Always normalises both dates to midnight local time to avoid off-by-one errors
 * caused by time-zone shifts.
 *
 * @param {string} dateString - ISO date string e.g. "2026-06-16"
 * @returns {number|null} - Positive = days in the future, 0 = today, negative = overdue, null = no date
 */
export const calculateDaysUntil = (dateString) => {
  if (!dateString) return null;

  // Parse as local date (split avoids UTC midnight shift)
  const [year, month, day] = dateString.split('-').map(Number);
  const target = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.round((target - today) / (1000 * 60 * 60 * 24));
};

/**
 * Format a days-until value as a human-readable string.
 *
 * @param {number|null} days
 * @returns {string}
 */
export const formatDaysUntil = (days) => {
  if (days === null) return 'No prediction';
  if (days > 1) return `in ${days} days`;
  if (days === 1) return 'Tomorrow';
  if (days === 0) return 'Today';
  return `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`;
};

/**
 * Format a date string as "Month Day, Year", e.g. "June 16, 2026".
 *
 * @param {string} dateString
 * @returns {string}
 */
export const formatFullDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a date range correctly handling same-month and cross-month spans.
 *
 * Same month  → "May 28 – May 31"
 * Cross month → "May 28 – June 3"
 *
 * @param {string} startStr - ISO date string
 * @param {string} endStr   - ISO date string
 * @returns {string}
 */
export const formatDateRange = (startStr, endStr) => {
  if (!startStr || !endStr) return 'Not available';

  const [sy, sm, sd] = startStr.split('-').map(Number);
  const [ey, em, ed] = endStr.split('-').map(Number);

  const start = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);

  const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'long' });

  const startDay = start.getDate();
  const endDay = end.getDate();

  return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
};

/**
 * Format a single date as "Month Day", e.g. "June 16".
 *
 * @param {string} dateString
 * @returns {string}
 */
export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
};
