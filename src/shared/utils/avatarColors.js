// src/shared/utils/avatarColors.js
// Returns a consistent background/text color pair for any username.
// Used in: Comments.jsx, CourseDetails.jsx (student reviews)
// Both files currently duplicate this exact array and logic.
//
// Usage:
//   import { getAvatarColor } from '@/shared/utils/avatarColors';
//   const { bg, color } = getAvatarColor(username);

const AVATAR_COLORS = [
  { bg: '#EEEDFE', color: '#534AB7' },
  { bg: '#FEF3C7', color: '#92400E' },
  { bg: '#D1FAE5', color: '#065F46' },
  { bg: '#FCE7F3', color: '#9D174D' },
  { bg: '#DBEAFE', color: '#1E40AF' },
];

/**
 * Deterministic color pair based on the first character of the string.
 * Same username always gets the same color — no randomness.
 *
 * @param {string} username
 * @returns {{ bg: string, color: string }}
 */
export const getAvatarColor = (username = 'A') =>
  AVATAR_COLORS[username.charCodeAt(0) % AVATAR_COLORS.length];

export default AVATAR_COLORS;
