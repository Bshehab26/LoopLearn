// src/features/admin/hooks/useAdminCategories.js
import { useState, useCallback, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/admin.api';

const useAdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = useCallback(async (categoryData) => {
    const response = await createCategory(categoryData);
    if (response.success) {
      setCategories(prev => [...prev, response.data]);
      setIsModalOpen(false);
    }
    return response;
  }, []);

  const editCategory = useCallback(async (id, categoryData) => {
    const response = await updateCategory(id, categoryData);
    if (response.success) {
      setCategories(prev => prev.map(c => 
        c.id === id ? { ...c, ...categoryData } : c
      ));
      setIsModalOpen(false);
      setEditingCategory(null);
    }
    return response;
  }, []);

  const removeCategory = useCallback(async (id) => {
    const response = await deleteCategory(id);
    if (response.success) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
    return response;
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return {
    categories,
    loading,
    error,
    isModalOpen,
    editingCategory,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
    openAddModal,
    openEditModal,
    closeModal,
  };
};

export default useAdminCategories;