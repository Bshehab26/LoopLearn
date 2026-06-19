// src/features/admin/pages/AllCourses.jsx

import React from 'react';
import PageHeader from '../components/common/PageHeader';
import CourseManagementPanel from '../components/courses/CourseManagementPanel';

const AllCourses = () => (
  <div>
    <PageHeader
      title="All Courses"
      subtitle="Filter, review, approve, and manage all courses on the platform."
    />
    <CourseManagementPanel />
  </div>
);

export default AllCourses;
