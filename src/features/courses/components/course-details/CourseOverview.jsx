// src/features/courses/components/course-details/CourseOverview.jsx

import React from 'react';
import { HiOutlineCheckCircle } from 'react-icons/hi';

const CourseOverview = ({ course }) => {
  const learningOutcomes = course?.learningOutcomes || course?.learningObjectives || [];
  const requirements = course?.requirements || [];

  return (
    <div className="space-y-4">
      {/* Learning Outcomes */}
      {learningOutcomes.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-2">What you'll learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {learningOutcomes.map((item, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <HiOutlineCheckCircle size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {course?.description && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{course.description}</p>
        </div>
      )}

      {/* Requirements */}
      {requirements.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-2">Requirements</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            {requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseOverview;