// src/shared/constants/config.js
// App-wide config — values that are referenced in 2+ places.
// If you need to change a default, change it here once.

/** Course categories — used in FilterDropdown.jsx and AddCourse.jsx */
export const CATEGORIES = [
  { label: 'Web Development', count: 42 },
  { label: 'Mobile Apps',     count: 28 },
  { label: 'Data Science',    count: 35 },
  { label: 'UI/UX Design',    count: 19 },
  { label: 'Cybersecurity',   count: 14 },
  { label: 'DevOps',          count: 21 },
  { label: 'AI & ML',         count: 31 },
];

/** Course category labels only — used in AddCourse.jsx select */
export const CATEGORY_LABELS = CATEGORIES.map((c) => c.label);

/**
 * Course difficulty levels — must match C# Level enum:
 * Beginner=0, Intermediate=1, Advanced=2
 * Used in: AddCourse.jsx, CourseDetails.jsx
 */
export const LEVELS = [
  { label: 'Beginner',     value: 0 },
  { label: 'Intermediate', value: 1 },
  { label: 'Advanced',     value: 2 },
];

/** Map numeric level → label — used in CourseDetails.jsx */
export const LEVEL_LABELS = Object.fromEntries(
  LEVELS.map((l) => [l.value, l.label])
);

/** Default pagination — used with usePagination hook */
export const PAGE_SIZE = {
  COURSES:     8,
  ENROLLMENTS: 5,
};

/** Toast auto-dismiss delay in ms — used in useProfile.js */
export const TOAST_DURATION = 3500;
