// src/features/admin/pages/InstructorApplications.jsx

import React from 'react';
import PageHeader from '../components/common/PageHeader';
import InstructorApplicationsPanel from '../components/users/InstructorApplicationsPanel';

const InstructorApplications = () => (
  <div>
    <PageHeader
      title="Instructor Applications"
      subtitle="Review and manage instructor role requests from users."
    />
    <InstructorApplicationsPanel />
  </div>
);

export default InstructorApplications;