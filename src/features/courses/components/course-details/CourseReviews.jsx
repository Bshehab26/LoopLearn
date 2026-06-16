// src/features/courses/components/course-details/CourseReviews.jsx

import React from 'react';
import { useAuth } from '../../../../store/AppProvider';
import Comments from '../Comments';

const Stars = ({ rating, size = 12 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} width={size} height={size} viewBox="0 0 24 24" 
        fill={star <= Math.floor(rating) ? '#F59E0B' : 'none'} 
        stroke="#F59E0B" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

const CourseReviews = ({ courseId, isEnrolled, onEnroll }) => {
  const { isAuthenticated } = useAuth();

  const canPostComment = isAuthenticated && isEnrolled;

  return (
    <div>
      {!canPostComment && isAuthenticated && (
        <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
          <p className="text-sm text-amber-700">
            Only enrolled students can leave a review.
          </p>
          <button onClick={onEnroll} className="mt-2 text-sm text-purple-600 font-medium hover:underline">
            Enroll to write a review →
          </button>
        </div>
      )}
      
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Please sign in to leave a review for this course.
          </p>
          <button onClick={onEnroll} className="mt-2 text-sm text-purple-600 font-medium hover:underline">
            Sign in to review →
          </button>
        </div>
      )}

      <Comments 
        courseId={courseId} 
        canPost={canPostComment}
        readOnly={!canPostComment}
      />
    </div>
  );
};

export default CourseReviews;