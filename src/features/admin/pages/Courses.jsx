// src/features/admin/pages/Courses.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseTable from '../components/CourseTable';
import CourseFilters from '../components/CourseFilters';
import useAdminCourses from '../hooks/useAdminCourses';

const Courses = () => {
  const navigate = useNavigate();
  const {
    courses,
    loading,
    pagination,
    fetchCourses,
    approveCourseById,
    rejectCourseById,
    removeCourse,
  } = useAdminCourses();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    category: '',
  });

  useEffect(() => {
    fetchCourses(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
        <p className="text-gray-500 mt-1">Manage all courses on the platform</p>
      </div>

      <CourseFilters filters={filters} onFilterChange={handleFilterChange} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <CourseTable
          courses={courses}
          loading={loading}
          onApprove={approveCourseById}
          onReject={rejectCourseById}
          onDelete={removeCourse}
          onView={handleViewCourse}
        />

        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-4 border-t border-gray-100">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 rounded-lg text-sm border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 rounded-lg text-sm border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;