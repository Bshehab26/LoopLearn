// src/features/admin/components/tags/TagManagementPanel.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTag,
} from 'react-icons/hi';
import { getTags, createTag, updateTag } from '../../api/admin.api';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import TableSkeleton from '../common/TableSkeleton';
import Modal from '../common/Modal';
import Pagination from '../../../../shared/components/Pagination';

const TagManagementPanel = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchTags = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTags({ page, pageSize });
      if (res.success) {
        setTags(res.data || []);
        setTotalItems(res.pagination?.totalCount || 0);
        setTotalPages(res.pagination?.totalPages || 1);
        setCurrentPage(res.pagination?.page || 1);
      } else {
        setError(res.message || 'Failed to load tags.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load tags.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags(currentPage);
  }, [currentPage, fetchTags]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (tag = null) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({ name: tag.name });
    } else {
      setEditingTag(null);
      setFormData({ name: '' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTag(null);
    setFormData({ name: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Tag name is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let res;
      if (editingTag) {
        res = await updateTag(editingTag.id, formData);
      } else {
        res = await createTag(formData);
      }
      if (res.success) {
        setToast({
          type: 'success',
          message: editingTag ? 'Tag updated successfully.' : 'Tag created successfully.'
        });
        setTimeout(() => setToast(null), 3000);
        // Reset to page 1 to show the new tag
        setCurrentPage(1);
        await fetchTags(1);
        handleCloseModal();
      } else {
        setError(res.message || 'Failed to save tag.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save tag.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && tags.length === 0) return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <TableSkeleton rows={4} columns={2} />
    </div>
  );

  if (error && !tags.length) return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <ErrorState message={error} onRetry={() => fetchTags(currentPage)} />
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
          className="fixed top-4 right-4 z-50 bg-white rounded-xl shadow-lg border border-green-200 px-4 py-3"
        >
          <p className="text-sm text-green-700">{toast.message}</p>
        </motion.div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <HiOutlineTag size={16} className="text-[#534AB7]" />
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {totalItems} Tags
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#534AB7] text-white hover:opacity-90 transition"
          >
            <HiOutlinePlus size={14} />
            Add Tag
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="2" className="px-4 py-8 text-center text-sm text-gray-400">
                    Loading tags...
                  </td>
                </tr>
              ) : tags.length === 0 ? (
                <tr>
                  <td colSpan="2" className="px-4 py-8 text-center text-sm text-gray-400">
                    No tags created yet.
                  </td>
                </tr>
              ) : (
                tags.map((tag, index) => (
                  <motion.tr
                    key={tag.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                    className="border-b border-gray-50 last:border-0 hover:bg-[#EEEDFE]/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800">{tag.name}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleOpenModal(tag)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#534AB7] hover:bg-[#EEEDFE] transition"
                      >
                        <HiOutlinePencil size={14} />
                      </button>
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

      {/* Add/Edit Modal */}
      <Modal 
        open={modalOpen} 
        onClose={handleCloseModal}
        title={editingTag ? 'Edit Tag' : 'Add Tag'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Tag Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Programming"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:border-[#534AB7] transition"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2.5 text-xs font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !formData.name.trim()}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl text-white bg-[#534AB7] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm hover:shadow-md"
            >
              {saving ? 'Saving…' : editingTag ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TagManagementPanel;