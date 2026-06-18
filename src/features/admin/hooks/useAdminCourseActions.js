// src/features/admin/hooks/useAdminCourseActions.js

import { useState } from 'react';
import { approveCourse, rejectCourse } from '../api/admin.api';

const useAdminCourseActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const approve = async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await approveCourse(courseId);
      return { ok: true, data: res.data, message: res.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not approve this course.';
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const reject = async (courseId, reason) => {
    setLoading(true);
    setError(null);
    try {
      const res = await rejectCourse(courseId, reason);
      return { ok: true, data: res.data, message: res.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not reject this course.';
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    approve,
    reject,
    loading,
    error,
    clearError: () => setError(null),
  };
};

export default useAdminCourseActions;