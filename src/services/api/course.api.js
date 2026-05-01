import api from "./axios";

/**
 * GET /api/course?page=1&pageSize=10
 * Returns paginated list of courses.
 * Response headers contain: Total-Count, Page, PageSize
 * Response body: CourseDTO[] — { id, avatar, title, price, category, rating, instructorName }
 */
export const getAllCourses = (page = 1, pageSize = 10) =>
  api.get(`/course?page=${page}&pageSize=${pageSize}`);

/**
 * GET /api/course/:id
 * Returns full course details.
 * Response body: CourseDetailsDTO — {
 *   id, title, price, category, rating,
 *   description, level, duration, createdAt, lastUpdatedAt,
 *   instructorName, instructorAvatar, instructorBio,
 *   comments: [{ studentName, avatar, comment, createdAt }],
 *   lessons:  [{ number, title }]
 * }
 */
export const getCourseById = (id) =>
  api.get(`/course/${id}`);