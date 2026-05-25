// src/shared/utils/validators.js
// Pure validation functions shared across auth and profile features.
// Used in: useAuth.js (signUp), ProfileInfo.jsx (email/phone fields)
//
// All functions return null on success or an error string on failure.

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {string|null}
 */
export const validateEmail = (email = '') => {
  if (!email.trim()) return 'Email is required.';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address.';
  return null;
};

/**
 * Validates an Egyptian phone number (01X XXXXXXXX).
 * @param {string} phone
 * @returns {string|null}
 */
export const validateEgyptianPhone = (phone = '') => {
  if (!phone.trim()) return 'Phone number is required.';
  if (!/^01[0125]\d{8}$/.test(phone))
    return 'Invalid phone number. Must start with 010, 011, 012, or 015.';
  return null;
};

/**
 * Validates a password meets minimum requirements.
 * @param {string} password
 * @param {number} minLength
 * @returns {string|null}
 */
export const validatePassword = (password = '', minLength = 6) => {
  if (!password) return 'Password is required.';
  if (password.length < minLength)
    return `Password must be at least ${minLength} characters.`;
  return null;
};

/**
 * Checks that two passwords match.
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {string|null}
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) return 'Passwords do not match.';
  return null;
};

/**
 * Validates that a required text field is not empty.
 * @param {string} value
 * @param {string} fieldName
 * @returns {string|null}
 */
export const validateRequired = (value = '', fieldName = 'This field') => {
  if (!value.trim()) return `${fieldName} is required.`;
  return null;
};

/**
 * Runs multiple validators and returns the first error found.
 * @param  {...(string|null)} errors
 * @returns {string|null}
 */
export const firstError = (...errors) =>
  errors.find((e) => e !== null) ?? null;
