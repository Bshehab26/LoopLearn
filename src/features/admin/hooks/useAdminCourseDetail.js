// src/features/admin/hooks/useAdminCourseDetail.js

import { useState, useEffect, useCallback } from 'react';
import { getAdminCourseById } from '../api/admin.api';

const useAdminCourseDetail = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminCourseById(courseId);
      
      console.log('[useAdminCourseDetail] Raw response:', res);
      
      if (res.success) {
        let courseData = null;
        
        // The backend returns: { success, data: { CourseDetails, InstructorDetails } }
        if (res.data) {
          // Check if the data has CourseDetails property (nested structure)
          if (res.data.CourseDetails) {
            courseData = res.data.CourseDetails;
            // Attach instructor info if available
            if (res.data.InstructorDetails) {
              courseData.instructor = res.data.InstructorDetails;
              // Also set the instructorName for display
              courseData.instructorName = res.data.InstructorDetails.FullName || res.data.InstructorDetails.fullName;
            }
          } else {
            // If the data is already the course object (flat structure)
            courseData = res.data;
          }
        }
        
        console.log('[useAdminCourseDetail] Processed course data:', courseData);
        setCourse(courseData);
      } else {
        setError(res.message || 'Failed to load course details.');
      }
    } catch (err) {
      console.error('[useAdminCourseDetail] Error:', err);
      setError(err.response?.data?.message || 'Failed to load course details.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) fetchDetail();
    else {
      setCourse(null);
      setError(null);
    }
  }, [courseId, fetchDetail]);

  return { course, loading, error, refetch: fetchDetail };
};

export default useAdminCourseDetail;