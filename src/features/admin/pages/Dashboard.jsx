// src/features/admin/pages/Dashboard.jsx
//
// Pure composition — all state and data fetching live in DashboardPanel.

import React from 'react';
import PageHeader from '../components/common/PageHeader';
import DashboardPanel from '../components/dashboard/DashboardPanel';

const Dashboard = () => (
  <div>
    <PageHeader
      title="Dashboard"
      subtitle="Platform overview — users, courses, enrollments, and revenue."
    />
    <DashboardPanel />
  </div>
);

export default Dashboard;
