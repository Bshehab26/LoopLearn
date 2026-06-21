// src/features/admin/components/categories/CategoryManagementPanel.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineFolder,
} from 'react-icons/hi';
import { getCategories, createCategory, updateCategory } from '../../api/admin.api';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import TableSkeleton from '../common/TableSkeleton';
import Modal from '../common/Modal';
import Pagination from '../../../../shared/components/Pagination';

const CategoryManagementPanel = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchCategories = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCategories({ page, pageSize });
      if (res.success) {
        setCategories(res.data || []);
        setTotalItems(res.pagination?.totalCount || 0);
        setTotalPages(res.pagination?.totalPages || 1);
        setCurrentPage(res.pagination?.page || 1);
      } else {
        setError(res.message || 'Failed to load categories.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage, fetchCategories]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Category name is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let res;
      if (editingCategory) {
        res = await updateCategory(editingCategory.id, formData);
      } else {
        res = await createCategory(formData);
      }
      if (res.success) {
        setToast({
          type: 'success',
          message: editingCategory ? 'Category updated successfully.' : 'Category created successfully.'
        });
        setTimeout(() => setToast(null), 3000);
        // Reset to page 1 to show the new category
        setCurrentPage(1);
        await fetchCategories(1);
        handleCloseModal();
      } else {
        setError(res.message || 'Failed to save category.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && categories.length === 0) return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <TableSkeleton rows={4} columns={3} />
    </div>
  );

  if (error && !categories.length) return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <ErrorState message={error} onRetry={() => fetchCategories(currentPage)} />
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
            <HiOutlineFolder size={16} className="text-[#534AB7]" />
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {totalItems} Categories
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#534AB7] text-white hover:opacity-90 transition"
          >
            <HiOutlinePlus size={14} />
            Add Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-sm text-gray-400">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-sm text-gray-400">
                    No categories created yet.
                  </td>
                </tr>
              ) : (
                categories.map((cat, index) => (
                  <motion.tr
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                    className="border-b border-gray-50 last:border-0 hover:bg-[#EEEDFE]/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800">{cat.name}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{cat.description || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleOpenModal(cat)}
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
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Web Development"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:border-[#534AB7] transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this category..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#534AB7]/20 focus:border-[#534AB7] transition"
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
              {saving ? 'Saving…' : editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryManagementPanel;