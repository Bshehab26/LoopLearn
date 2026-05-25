// src/shared/utils/formatters.js
// Pure formatting helpers used across multiple features.
// No React imports — these are plain functions, safe to use anywhere.

/* ── Date ─────────────────────────────────────────────────────────────────── */

/**
 * Returns a human-readable "time ago" string.
 * Used in: Comments.jsx, CourseDetails.jsx
 *
 * @param {string} dateStr  — ISO date string e.g. "2025-03-12"
 * @returns {string}        — "Today", "Yesterday", "3 days ago", "2 months ago"…
 */
export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (diff === 0)   return 'Today';
  if (diff === 1)   return 'Yesterday';
  if (diff < 30)    return `${diff} days ago`;
  if (diff < 365)   return `${Math.floor(diff / 30)} months ago`;
  return `${Math.floor(diff / 365)} years ago`;
};

/**
 * Formats a JS Date or ISO string to "Month YYYY".
 * Used in: ProfileHeader.jsx (member since)
 *
 * @param {string|Date} date
 * @returns {string}  — e.g. "January 2024"
 */
export const formatMonthYear = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

/* ── Currency ─────────────────────────────────────────────────────────────── */

/**
 * Formats a number as a currency string.
 * Used in: CourseCard.jsx, Dashboard.jsx, MyCourses.jsx, EditCourse.jsx
 *
 * @param {number} amount
 * @param {string} symbol  — currency symbol from AppContext e.g. "$"
 * @returns {string}       — e.g. "$29.99"
 */
export const formatPrice = (amount, symbol = '$') => {
  if (amount === undefined || amount === null) return `${symbol}0.00`;
  return `${symbol}${Number(amount).toFixed(2)}`;
};

/* ── Text ─────────────────────────────────────────────────────────────────── */

/**
 * Truncates a string to a max length, appending "…".
 * Used in: CourseDetails.jsx (description preview), CourseSection.jsx
 *
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (text = '', maxLength = 120) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
};

/**
 * Converts a username to its 2-letter initials (uppercase).
 * Used in: Comments.jsx, Navbar.jsx, ProfileHeader.jsx
 *
 * @param {string} username
 * @returns {string}  — e.g. "AL"
 */
export const getInitials = (username = '') =>
  username.slice(0, 2).toUpperCase() || '??';

/* ── Duration ─────────────────────────────────────────────────────────────── */

/**
 * Converts total minutes to a "Xh Ym" string.
 * Used in: CourseDetails.jsx badges, MyCourses.jsx
 *
 * @param {number} minutes
 * @returns {string}  — e.g. "2h 30m" or "45m"
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};
