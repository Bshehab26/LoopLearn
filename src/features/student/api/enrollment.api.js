// Get all enrolled courses
const enrolled = await getEnrolledCourses();
if (enrolled.success) {
  console.log('Enrolled courses:', enrolled.data);
}

// Get progress for a single course
const progress = await getCourseProgress(123);
if (progress.success) {
  console.log(`Progress: ${progress.data.percentage}%`);
}

// Update lesson progress
const update = await updateProgress(123, 456, true);
if (update.success) {
  console.log('Lesson completed!');
}

// Enroll in a new course
const enrollment = await enrollInCourse(789);
if (enrollment.success) {
  console.log('Successfully enrolled!');
}

// Get progress for multiple courses at once
const multipleProgress = await getMultipleCoursesProgress([123, 456, 789]);
if (multipleProgress.success) {
  console.log('Progress maps:', multipleProgress.data);
}