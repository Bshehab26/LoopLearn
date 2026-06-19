// src/features/admin/pages/PendingCourses.jsx

import React from 'react';
import PageHeader from '../components/common/PageHeader';
import PendingCoursesPanel from '../components/courses/PendingCoursesPanel';

const PendingCourses = () => (
  <div>
    <PageHeader
      title="Pending Review"
      subtitle="Courses submitted by instructors awaiting your approval — oldest first."
    />
    <PendingCoursesPanel />
  </div>
);

export default PendingCourses;
