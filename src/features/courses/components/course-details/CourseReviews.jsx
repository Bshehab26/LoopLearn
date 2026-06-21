// src/features/courses/components/course-details/CourseReviews.jsx
//
// Reviews = Feedbacks. This component delegates entirely to FeedbackSection.
// On the Course Detail page: readOnly={true} → all reviews shown, no write UI.
// On the Watch page (if you embed it there): pass readOnly={false} to enable
// the post / edit / delete form for enrolled students.

import React from 'react';
import FeedbackSection from '../FeedbackSection';

const CourseReviews = ({ courseId, readOnly = true }) => (
  <FeedbackSection courseId={courseId} readOnly={readOnly} />
);

export default CourseReviews;