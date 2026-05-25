// src/shared/constants/roles.js
// User role constants — single source of truth.

export const ROLES = {
  STUDENT: 'Student',     // Match backend: "Student" (capital S)
  INSTRUCTOR: 'Instructor',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'SuperAdmin',
};

/** All roles that can access the platform as a learner */
export const LEARNER_ROLES = [ROLES.STUDENT, ROLES.INSTRUCTOR];

/** Role hierarchy for permission checking */
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.INSTRUCTOR, ROLES.STUDENT],
  [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.INSTRUCTOR, ROLES.STUDENT],
  [ROLES.INSTRUCTOR]: [ROLES.INSTRUCTOR, ROLES.STUDENT],
  [ROLES.STUDENT]: [ROLES.STUDENT],
};