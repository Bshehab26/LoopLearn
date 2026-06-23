// src/features/admin/pages/AllCourses.jsx

import React from 'react';
import PageHeader from '../components/common/PageHeader';
import CourseManagementPanel from '../components/courses/CourseManagementPanel';

const AllCourses = () => (
  <div className="h-full flex flex-col">
    <PageHeader
      title="All Courses"
      subtitle="Filter, review, approve, and manage all courses on the platform."
    />
    <div className="flex-1 min-h-0">
      <CourseManagementPanel />
    </div>
  </div>
);

export default AllCourses;