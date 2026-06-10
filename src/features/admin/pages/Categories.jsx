// src/features/admin/pages/Categories.jsx

import CategoryManager from '../components/CategoryManager';
import CategoryForm from '../components/CategoryForm';
import useAdminCategories from '../hooks/useAdminCategories';

const Categories = () => {
  const {
    categories,
    loading,
    isModalOpen,
    editingCategory,
    addCategory,
    editCategory,
    removeCategory,
    openAddModal,
    openEditModal,
    closeModal,
  } = useAdminCategories();

  const handleSave = async (formData) => {
    if (editingCategory) {
      return await editCategory(editingCategory.id, formData);
    } else {
      return await addCategory(formData);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This may affect courses using it.')) {
      await removeCategory(id);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
        <p className="text-gray-500 mt-1">Manage course categories</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <CategoryManager
          categories={categories}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onAdd={openAddModal}
        />
      </div>

      <CategoryForm
        isOpen={isModalOpen}
        category={editingCategory}
        onSave={handleSave}
        onClose={closeModal}
        loading={false}
      />
    </div>
  );
};

export default Categories;