// src/features/admin/components/users/InstructorApplicationsPanel.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineUserAdd, 
  HiOutlineCheckCircle, 
  HiOutlineXCircle,
  HiOutlineEye,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineCalendar,
} from 'react-icons/hi';
import { getInstructorApplications, rejectInstructorApplication } from '../../api/admin.api';
import useAdminUserActions from '../../hooks/useAdminUserActions';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import TableSkeleton from '../common/TableSkeleton';
import Modal from '../common/Modal';
import Pagination from '../../../../shared/components/Pagination';

const InstructorApplicationsPanel = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [toast, setToast] = useState(null);
  
  const pageSize = 10;
  const { changeRole } = useAdminUserActions();

  const fetchApplications = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [DEBUG] Fetching applications - Page:', page, 'PageSize:', pageSize);
      
      const res = await getInstructorApplications({ page, pageSize });
      
      console.log('📦 [DEBUG] Raw API Response:', res);
      console.log('📊 [DEBUG] Response data:', res.data);
      console.log('📄 [DEBUG] Pagination:', res.pagination);
      
      if (res.success) {
        // Log each application's details
        console.log('👤 [DEBUG] All applications from backend:');
        res.data?.forEach((app, index) => {
          console.log(`  ${index + 1}. ID: ${app.userId || app.id}, Name: ${app.fullName || app.userName}, Email: ${app.email}, Status: ${app.status || 'No status field'}`);
        });
        
        // Filter out applications that have been approved or rejected
        const pendingApplications = (res.data || []).filter(app => {
          // Check if app has status field
          if (app.status) {
            const isPending = app.status.toLowerCase() === 'pending';
            console.log(`🔎 [DEBUG] App ${app.fullName || app.userName}: status=${app.status}, isPending=${isPending}`);
            return isPending;
          }
          // If there's no status field, check if it has an approved flag
          if (app.isApproved !== undefined) {
            const isPending = !app.isApproved;
            console.log(`🔎 [DEBUG] App ${app.fullName || app.userName}: isApproved=${app.isApproved}, isPending=${isPending}`);
            return isPending;
          }
          // If there's no status or approved flag, assume it's pending
          console.log(`🔎 [DEBUG] App ${app.fullName || app.userName}: No status field, assuming pending`);
          return true;
        });
        
        console.log('✅ [DEBUG] Pending applications after filter:', pendingApplications.length);
        pendingApplications.forEach((app, index) => {
          console.log(`  ${index + 1}. ${app.fullName || app.userName} (${app.userId}) - ${app.status || 'No status'}`);
        });
        
        setApplications(pendingApplications);
        setTotalItems(pendingApplications.length);
        const newTotalPages = Math.max(1, Math.ceil(pendingApplications.length / pageSize));
        setTotalPages(newTotalPages);
        setCurrentPage(page);
      } else {
        console.error('❌ [DEBUG] API returned success=false:', res.message);
        setError(res.message || 'Failed to load applications.');
      }
    } catch (err) {
      console.error('❌ [DEBUG] Error fetching applications:', err);
      setError(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications(currentPage);
  }, [currentPage, fetchApplications]);

  const handlePageChange = (page) => {
    console.log('📄 [DEBUG] Page changed to:', page);
    setCurrentPage(page);
  };

  const handleViewDetails = (application) => {
    console.log('👁️ [DEBUG] Viewing details for:', application);
    setSelectedApplication(application);
    setDetailModalOpen(true);
  };

  const handleApprove = async (application) => {
    console.log('✅ [DEBUG] Approving application:', application);
    console.log(`  - UserId: ${application.userId}`);
    console.log(`  - Name: ${application.fullName || application.userName}`);
    console.log(`  - Email: ${application.email}`);
    
    setActionLoading(true);
    setActionError(null);
    try {
      // Auto-approve: change role to Instructor
      console.log('🚀 [DEBUG] Calling changeRole with:', { userId: application.userId, newRole: 'Instructor' });
      
      const result = await changeRole(application.userId, 'Instructor');
      
      console.log('📦 [DEBUG] changeRole result:', result);
      
      if (result.ok) {
        console.log('✅ [DEBUG] Approval successful!');
        
        setToast({
          type: 'success',
          message: `${application.fullName || application.userName} has been approved as an Instructor.`
        });
        
        // Remove the approved application from the list immediately
        setApplications(prev => {
          const newApps = prev.filter(app => app.userId !== application.userId);
          console.log(`📊 [DEBUG] Applications after removal: ${newApps.length} (was ${prev.length})`);
          return newApps;
        });
        
        setTotalItems(prev => {
          const newTotal = prev - 1;
          console.log(`📊 [DEBUG] Total items after removal: ${newTotal} (was ${prev})`);
          return newTotal;
        });
        
        // Recalculate total pages
        const newTotal = totalItems - 1;
        const newTotalPages = Math.max(1, Math.ceil(newTotal / pageSize));
        setTotalPages(newTotalPages);
        console.log(`📄 [DEBUG] New total pages: ${newTotalPages}`);
        
        // If current page has no items, go to previous page
        if (currentPage > newTotalPages) {
          console.log(`📄 [DEBUG] Current page ${currentPage} > new total pages ${newTotalPages}, moving to page ${newTotalPages}`);
          setCurrentPage(newTotalPages);
        }
        
        setTimeout(() => setToast(null), 3000);
        setDetailModalOpen(false);
        
        // 🔍 DEBUG: Verify the user's current role after approval
        try {
          console.log('🔍 [DEBUG] Verifying user role after approval...');
          // You'll need to import getAdminUserById
          // const userCheck = await getAdminUserById(application.userId);
          // console.log('👤 [DEBUG] User after approval:', userCheck);
        } catch (verifyErr) {
          console.warn('⚠️ [DEBUG] Could not verify user role:', verifyErr);
        }
        
      } else {
        console.error('❌ [DEBUG] Approval failed:', result.error);
        setActionError(result.error || 'Failed to approve application.');
      }
    } catch (err) {
      console.error('❌ [DEBUG] Error in handleApprove:', err);
      setActionError(err.message || 'Failed to approve application.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (application) => {
    console.log('❌ [DEBUG] Rejecting application:', application);
    console.log(`  - UserId: ${application.userId}`);
    console.log(`  - Name: ${application.fullName || application.userName}`);
    
    setActionLoading(true);
    setActionError(null);
    try {
      console.log('🚀 [DEBUG] Calling rejectInstructorApplication with userId:', application.userId);
      
      const res = await rejectInstructorApplication(application.userId);
      
      console.log('📦 [DEBUG] rejectInstructorApplication result:', res);
      
      if (res.success) {
        console.log('✅ [DEBUG] Rejection successful!');
        
        setToast({
          type: 'warning',
          message: `${application.fullName || application.userName}'s application has been rejected.`
        });
        
        // Remove the rejected application from the list immediately
        setApplications(prev => {
          const newApps = prev.filter(app => app.userId !== application.userId);
          console.log(`📊 [DEBUG] Applications after removal: ${newApps.length} (was ${prev.length})`);
          return newApps;
        });
        
        setTotalItems(prev => {
          const newTotal = prev - 1;
          console.log(`📊 [DEBUG] Total items after removal: ${newTotal} (was ${prev})`);
          return newTotal;
        });
        
        // Recalculate total pages
        const newTotal = totalItems - 1;
        const newTotalPages = Math.max(1, Math.ceil(newTotal / pageSize));
        setTotalPages(newTotalPages);
        console.log(`📄 [DEBUG] New total pages: ${newTotalPages}`);
        
        // If current page has no items, go to previous page
        if (currentPage > newTotalPages) {
          console.log(`📄 [DEBUG] Current page ${currentPage} > new total pages ${newTotalPages}, moving to page ${newTotalPages}`);
          setCurrentPage(newTotalPages);
        }
        
        setRejectModalOpen(false);
        setRejectReason('');
        setDetailModalOpen(false);
        setTimeout(() => setToast(null), 3000);
      } else {
        console.error('❌ [DEBUG] Rejection failed:', res.message);
        setActionError(res.message || 'Failed to reject application.');
      }
    } catch (err) {
      console.error('❌ [DEBUG] Error in handleReject:', err);
      setActionError(err.message || 'Failed to reject application.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenRejectModal = (application) => {
    console.log('🚪 [DEBUG] Opening reject modal for:', application);
    setSelectedApplication(application);
    setRejectReason('');
    setActionError(null);
    setRejectModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Log component state changes
  useEffect(() => {
    console.log('📊 [DEBUG] Component state updated:');
    console.log(`  - applications: ${applications.length} items`);
    console.log(`  - totalItems: ${totalItems}`);
    console.log(`  - totalPages: ${totalPages}`);
    console.log(`  - currentPage: ${currentPage}`);
    console.log(`  - loading: ${loading}`);
    console.log(`  - error: ${error}`);
  }, [applications, totalItems, totalPages, currentPage, loading, error]);

  if (loading && applications.length === 0) return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <TableSkeleton rows={4} columns={4} />
    </div>
  );

  if (error && !applications.length) return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <ErrorState message={error} onRetry={() => fetchApplications(currentPage)} />
    </div>
  );

  return (
    <div>
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 bg-white rounded-xl shadow-lg border px-4 py-3 ${
            toast.type === 'success' ? 'border-green-200' : 'border-yellow-200'
          }`}
        >
          <p className={`text-sm ${toast.type === 'success' ? 'text-green-700' : 'text-yellow-700'}`}>
            {toast.message}
          </p>
        </motion.div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <HiOutlineUserAdd size={16} className="text-[#534AB7]" />
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {totalItems} Pending Applications
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-sm text-gray-400">
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-sm text-gray-400">
                    No pending instructor applications.
                  </td>
                </tr>
              ) : (
                applications.map((app, index) => (
                  <motion.tr
                    key={app.id || app.userId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                    className="border-b border-gray-50 last:border-0 hover:bg-[#EEEDFE]/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {app.avatar ? (
                          <img
                            src={app.avatar}
                            alt={app.fullName || app.userName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {((app.fullName || app.userName || 'U')[0]).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-gray-800">
                          {app.fullName || app.userName || 'Unknown User'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {app.email || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(app.submittedAt || app.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewDetails(app)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#534AB7] hover:bg-[#EEEDFE] transition"
                          title="View Details"
                        >
                          <HiOutlineEye size={16} />
                        </button>
                        <button
                          onClick={() => handleApprove(app)}
                          disabled={actionLoading}
                          className="p-1.5 rounded-lg text-green-500 hover:text-green-600 hover:bg-green-50 transition disabled:opacity-50"
                          title="Approve"
                        >
                          <HiOutlineCheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenRejectModal(app)}
                          disabled={actionLoading}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                          title="Reject"
                        >
                          <HiOutlineXCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal 
        open={detailModalOpen} 
        onClose={() => setDetailModalOpen(false)}
        title="Application Details"
      >
        {selectedApplication && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              {selectedApplication.avatar ? (
                <img
                  src={selectedApplication.avatar}
                  alt={selectedApplication.fullName || selectedApplication.userName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">
                    {((selectedApplication.fullName || selectedApplication.userName || 'U')[0]).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800">
                  {selectedApplication.fullName || selectedApplication.userName || 'Unknown User'}
                </p>
                <p className="text-sm text-gray-500">{selectedApplication.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <HiOutlineCalendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Submitted:</span>
                <span className="text-gray-800">{formatDate(selectedApplication.submittedAt || selectedApplication.createdAt)}</span>
              </div>
              {selectedApplication.message && (
                <div className="bg-gray-50 rounded-lg p-3 mt-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Message</p>
                  <p className="text-sm text-gray-700">{selectedApplication.message}</p>
                </div>
              )}
              {selectedApplication.experience && (
                <div className="bg-gray-50 rounded-lg p-3 mt-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Experience</p>
                  <p className="text-sm text-gray-700">{selectedApplication.experience}</p>
                </div>
              )}
            </div>

            {actionError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {actionError}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => handleOpenRejectModal(selectedApplication)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedApplication)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#534AB7] text-white hover:opacity-90 transition disabled:opacity-50 shadow-sm hover:shadow-md"
              >
                {actionLoading ? 'Processing...' : 'Approve as Instructor'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal 
        open={rejectModalOpen} 
        onClose={() => setRejectModalOpen(false)}
        title="Reject Application"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          if (selectedApplication) {
            handleReject(selectedApplication);
          }
        }} className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to reject <span className="font-medium text-gray-800">
              {selectedApplication?.fullName || selectedApplication?.userName}
            </span>'s instructor application?
          </p>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Reason <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Provide a reason for rejection..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none
                focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:border-[#534AB7]"
            />
          </div>

          {actionError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {actionError}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setRejectModalOpen(false);
                setRejectReason('');
                setActionError(null);
              }}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition shadow-sm hover:shadow-md"
            >
              {actionLoading ? 'Processing...' : 'Reject Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InstructorApplicationsPanel;