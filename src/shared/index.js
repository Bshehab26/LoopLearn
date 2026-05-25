// src/shared/index.js — barrel export for everything in shared/

// ── Components ──────────────────────────────────────────────────────────────
export { default as Navbar }  from './components/Navbar';
export { default as Footer }  from './components/Footer';
export { default as Loading } from './components/Loading';
export { default as Rating }  from './components/Rating';

// ── Hooks ───────────────────────────────────────────────────────────────────
export { default as useDebounce }     from './hooks/useDebounce';
export { default as usePagination }   from './hooks/usePagination';
export { default as useScrollToTop }  from './hooks/useScrollToTop';
export { default as useOutsideClick } from './hooks/useOutsideClick';

// ── Utils ────────────────────────────────────────────────────────────────────
export { timeAgo, formatMonthYear, formatPrice, truncate, getInitials, formatDuration } from './utils/formatters';
export { getAvatarColor }   from './utils/avatarColors';
export { validateEmail, validateEgyptianPhone, validatePassword, validatePasswordMatch, validateRequired, firstError } from './utils/validators';

// ── Constants ────────────────────────────────────────────────────────────────
export { ROUTES }                     from './constants/routes';
export { ROLES, LEARNER_ROLES }       from './constants/roles';
export { CATEGORIES, CATEGORY_LABELS, LEVELS, LEVEL_LABELS, PAGE_SIZE, TOAST_DURATION } from './constants/config';
