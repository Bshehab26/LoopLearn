// src/features/admin/pages/AdminUserDetailPage.jsx
//
// Full-page admin user view. Uses GET /api/Admin/users/{id} which returns
// AdminUserDetailDTO:
//   { id, fullName, userName, email, role, bio, profileImageUrl,
//     isLocked, createdAt, lastLoginAt, enrollmentCount?, courseCount? }
//
// NOTE ON DATA AVAILABILITY:
//   The backend's /users/{id} endpoint returns counts only — not lists.
//   The role-specific detail sections (student's enrolled courses with
//   progress, instructor's courses with student counts, admin's review
//   history) each note what backend endpoint would be needed to populate
//   them. Until those exist, the sections show the count alongside a
//   clear "coming soon" state rather than fake data.
//
// Inline actions (ban/unban, role change) are wired to the same real hooks
// used by the Users table — no duplication.

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineClipboardList,
  HiOutlineUserCircle,
  HiOutlineLockClosed,
  HiOutlineLockOpen,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from 'react-icons/hi';

import { useAuth } from '../../../store/AppProvider';
import useAdminUserDetail from '../hooks/useAdminUserDetail';
import useAdminUserActions from '../hooks/useAdminUserActions';
import Avatar from '../components/common/Avatar';
import StatusBadge from '../components/common/StatusBadge';
import UserRoleBadge from '../components/users/UserRoleBadge';
import UserRoleChangeModal from '../components/users/UserRoleChangeModal';
import UserBanModal from '../components/users/UserBanModal';
import ErrorState from '../components/common/ErrorState';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';
const formatDateTime = (d) =>
  d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—';

// ── Generic "needs backend endpoint" placeholder ────────────────────────────
const EndpointNeeded = ({ icon: Icon, count, countLabel, endpointNote }) => (
  <div className="flex flex-col items-center text-center py-8 px-4">
    <div className="w-12 h-12 rounded-full bg-[#EEEDFE] flex items-center justify-center mb-3">
      <Icon size={22} className="text-[#534AB7]" />
    </div>
    {count != null && (
      <p className="text-2xl font-bold text-gray-800 mb-1">{count}</p>
    )}
    <p className="text-sm font-medium text-gray-600">{countLabel}</p>
    <p className="text-xs text-gray-400 mt-2 max-w-xs">
      Detailed list view requires:{' '}
      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-600">
        {endpointNote}
      </code>
    </p>
  </div>
);

// ── Student section ─────────────────────────────────────────────────────────
const StudentSection = ({ user }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
      <HiOutlineAcademicCap size={16} className="text-[#534AB7]" />
      <h3 className="text-sm font-semibold text-gray-700">Enrolled courses</h3>
      <span className="ml-auto text-xs text-gray-400">{user.enrollmentCount ?? 0} total</span>
    </div>
    <EndpointNeeded
      icon={HiOutlineAcademicCap}
      count={user.enrollmentCount}
      countLabel={`course${user.enrollmentCount !== 1 ? 's' : ''} enrolled`}
      endpointNote="GET /api/Admin/users/{id}/enrollments"
    />
    <p className="pb-4 text-center text-[11px] text-gray-400">
      Would show: course title, instructor, progress %, completion status, last accessed
    </p>
  </div>
);

// ── Instructor section ──────────────────────────────────────────────────────
const InstructorSection = ({ user }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
      <HiOutlineBookOpen size={16} className="text-[#534AB7]" />
      <h3 className="text-sm font-semibold text-gray-700">Courses</h3>
      <span className="ml-auto text-xs text-gray-400">{user.courseCount ?? 0} total</span>
    </div>
    <EndpointNeeded
      icon={HiOutlineBookOpen}
      count={user.courseCount}
      countLabel={`course${user.courseCount !== 1 ? 's' : ''} created`}
      endpointNote="GET /api/Admin/users/{id}/courses"
    />
    <p className="pb-4 text-center text-[11px] text-gray-400">
      Would show: course title, status, enrollment count, revenue, creation date
    </p>
  </div>
);

// ── Admin section ───────────────────────────────────────────────────────────
const AdminActivitySection = ({ user }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
      <HiOutlineClipboardList size={16} className="text-[#534AB7]" />
      <h3 className="text-sm font-semibold text-gray-700">Review activity</h3>
    </div>
    <EndpointNeeded
      icon={HiOutlineClipboardList}
      count={null}
      countLabel="courses reviewed"
      endpointNote="GET /api/Admin/review-history?performedBy={id}"
    />
    <p className="pb-4 text-center text-[11px] text-gray-400">
      Would show: course name, action (Approved/Rejected), reason, date
    </p>
  </div>
);

// ── Page skeleton ───────────────────────────────────────────────────────────
const PageSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-7 bg-gray-100 rounded w-32" />
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
      <div className="w-20 h-20 rounded-full bg-gray-100" />
      <div className="flex-1 space-y-2 pt-2">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="h-3 bg-gray-100 rounded w-1/5 mt-2" />
      </div>
    </div>
    <div className="h-48 bg-white rounded-xl border border-gray-200" />
  </div>
);

// ── Main page ───────────────────────────────────────────────────────────────
const AdminUserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const { user, loading, error, refetch } = useAdminUserDetail(id);

  const {
    banUser, unbanUser, changeRole,
    statusLoading, statusError, clearStatusError,
    roleLoading, roleError, clearRoleError,
  } = useAdminUserActions();

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);

  const isSelf = user?.id === currentUser?.id;
  const isSuperAdmin = user?.role === 'SuperAdmin';
  const canAct = !isSelf && !isSuperAdmin;

  const handleBanSubmit = async (isBanning, reason) => {
    const result = isBanning
      ? await banUser(user.id, reason)
      : await unbanUser(user.id, reason);
    if (result.ok) refetch();
    return result.ok;
  };

  const handleRoleSubmit = async (newRole) => {
    const result = await changeRole(user.id, newRole);
    if (result.ok) refetch();
    return result.ok;
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <PageSkeleton />
    </div>
  );

  if (error || !user) return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl border border-gray-200">
        <ErrorState message={error || 'User not found.'} onRetry={refetch} />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <HiOutlineArrowLeft size={16} /> Back to users
      </button>

      {/* ── Profile card ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row gap-5">

          {/* Avatar + name */}
          <div className="flex items-start gap-4">
            <Avatar name={user.fullName} imageUrl={user.profileImageUrl} size={72} />
            <div>
              <h2 className="text-lg font-bold text-gray-900">{user.fullName}</h2>
              <p className="text-sm text-gray-500">@{user.userName}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <UserRoleBadge role={user.role} />
                {user.isLocked
                  ? <StatusBadge label="Banned" tone="red" dot />
                  : <StatusBadge label="Active" tone="green" dot />}
              </div>
            </div>
          </div>

          {/* Action buttons — right side */}
          {canAct && (
            <div className="sm:ml-auto flex sm:flex-col gap-2 flex-wrap">
              <button
                onClick={() => { clearRoleError(); setRoleModalOpen(true); }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg
                  border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <HiOutlineUserCircle size={14} /> Change role
              </button>
              <button
                onClick={() => { clearStatusError(); setBanModalOpen(true); }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg
                  border transition
                  ${user.isLocked
                    ? 'border-green-200 text-green-700 hover:bg-green-50'
                    : 'border-red-200 text-red-600 hover:bg-red-50'}`}
              >
                {user.isLocked
                  ? <><HiOutlineLockOpen size={14} /> Unban user</>
                  : <><HiOutlineLockClosed size={14} /> Ban user</>}
              </button>
            </div>
          )}
          {isSelf && (
            <p className="sm:ml-auto text-xs text-gray-400 self-center">This is your account</p>
          )}
          {isSuperAdmin && !isSelf && (
            <p className="sm:ml-auto text-xs text-gray-400 self-center">SuperAdmin — cannot be modified</p>
          )}
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Contact + activity */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiOutlineMail size={15} className="text-gray-400 flex-shrink-0" />
            {user.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiOutlineCalendar size={15} className="text-gray-400 flex-shrink-0" />
            Joined {formatDate(user.createdAt)}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiOutlineClock size={15} className="text-gray-400 flex-shrink-0" />
            Last login {formatDateTime(user.lastLoginAt)}
          </div>
        </div>
      </div>

      {/* ── Role-specific sections ────────────────────────────────────────── */}
      {user.role === 'Student' && <StudentSection user={user} />}

      {user.role === 'Instructor' && (
        <>
          <InstructorSection user={user} />
          {/* Instructors can also be enrolled as students */}
          {user.enrollmentCount != null && user.enrollmentCount > 0 && (
            <StudentSection user={user} />
          )}
        </>
      )}

      {(user.role === 'Admin' || user.role === 'SuperAdmin') && (
        <>
          <AdminActivitySection user={user} />
          {/* Admins may also have enrollments */}
          {user.enrollmentCount != null && user.enrollmentCount > 0 && (
            <StudentSection user={user} />
          )}
        </>
      )}

      {/* Modals */}
      <UserRoleChangeModal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        user={user}
        canAssignAdmin={currentUser?.role === 'SuperAdmin'}
        onSubmit={handleRoleSubmit}
        loading={roleLoading}
        error={roleError}
      />
      <UserBanModal
        open={banModalOpen}
        onClose={() => setBanModalOpen(false)}
        user={user}
        onSubmit={handleBanSubmit}
        loading={statusLoading}
        error={statusError}
      />
    </div>
  );
};

export default AdminUserDetailPage;
