// src/features/admin/pages/AllCourses.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiDownload } from 'react-icons/hi';
import CourseTable from '../components/CourseTable';
import CourseFilters from '../components/CourseFilters';
import useAdminAllCourses from '../hooks/useAdminAllCourses';

const AllCourses = () => {
  const navigate = useNavigate();
  const { courses, loading, fetchCourses, deleteCourse } = useAdminAllCourses();
  const [filters, setFilters] = useState({ search: '', status: '', page: 1 });

  useEffect(() => {
    fetchCourses(filters);
  }, [filters]);

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(courseId);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Courses</h1>
        <p className="text-gray-500 mt-1">Manage all courses on the platform</p>
      </div>

      <CourseFilters filters={filters} onFilterChange={setFilters} />

      <div className="mb-4 text-sm text-gray-500">
        Showing {courses.length} courses
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <CourseTable
          courses={courses}
          loading={loading}
          onDelete={handleDeleteCourse}
          onView={handleViewCourse}
        />
      </div>
    </div>
  );
};

export default AllCourses;