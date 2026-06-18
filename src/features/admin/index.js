// src/features/admin/index.js

// API
export {
  getAdminUsers,
  getAdminUserById,
  updateUserStatus,
  updateUserRole,
  getAdminDashboardStats,
  getAdminCourses,
  getAdminCourseById,
  getPendingCourses,
  approveCourse,
  rejectCourse,
} from './api/admin.api';

// Hooks
export { default as useAdminStats } from './hooks/useAdminStats';
export { default as useAdminUsers } from './hooks/useAdminUsers';
export { default as useAdminUserActions } from './hooks/useAdminUserActions';
export { default as useAdminUserDetail } from './hooks/useAdminUserDetail';
export { default as useAdminCourses } from './hooks/useAdminCourses';
export { default as useAdminCourseActions } from './hooks/useAdminCourseActions';
export { default as useAdminCourseDetail } from './hooks/useAdminCourseDetail';

// Components - Common
export { default as Avatar } from './components/common/Avatar';
export { default as Drawer } from './components/common/Drawer';
export { default as EmptyState } from './components/common/EmptyState';
export { default as ErrorState } from './components/common/ErrorState';
export { default as Modal } from './components/common/Modal';
export { default as PageHeader } from './components/common/PageHeader';
export { default as StatusBadge } from './components/common/StatusBadge';
export { default as TableSkeleton } from './components/common/TableSkeleton';

// Components - Courses
export { default as CourseActionsMenu } from './components/courses/CourseActionsMenu';
export { default as CourseDetailDrawer } from './components/courses/CourseDetailDrawer';
export { default as CourseFilters } from './components/courses/CourseFilters';
export { default as CourseStatusBadge } from './components/courses/CourseStatusBadge';
export { default as CourseTable } from './components/courses/CourseTable';
export { default as RejectCourseModal } from './components/courses/RejectCourseModal';

// Components - Dashboard
export { default as Chart } from './components/dashboard/Chart';
export { default as ChartCard } from './components/dashboard/ChartCard';
export { default as CourseStatusChart } from './components/dashboard/CourseStatusChart';
export { default as DashboardPanel } from './components/dashboard/DashboardPanel';
export { default as EnrollmentStatusChart } from './components/dashboard/EnrollmentStatusChart';
export { default as PaymentStatusChart } from './components/dashboard/PaymentStatusChart';
export { default as StatsCard } from './components/dashboard/StatsCard';
export { default as StatsGrid } from './components/dashboard/StatsGrid';
export { default as UserRoleChart } from './components/dashboard/UserRoleChart';

// Components - Users
export { default as UserActionsMenu } from './components/users/UserActionsMenu';
export { default as UserBanModal } from './components/users/UserBanModal';
export { default as UserDetailDrawer } from './components/users/UserDetailDrawer';
export { default as UserFilters } from './components/users/UserFilters';
export { default as UserManagementPanel } from './components/users/UserManagementPanel';
export { default as UserRoleBadge } from './components/users/UserRoleBadge';
export { default as UserRoleChangeModal } from './components/users/UserRoleChangeModal';
export { default as UserTable } from './components/users/UserTable';

// Pages
export { default as Dashboard } from './pages/Dashboard';
export { default as PendingCourses } from './pages/PendingCourses';
export { default as AllCourses } from './pages/AllCourses';
export { default as Users } from './pages/Users';

// Utils
export { formatCurrency, formatNumber } from './utils/format';