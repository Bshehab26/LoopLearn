// src/features/admin/components/CategoryManager.jsx

import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
import { motion } from 'framer-motion';

const CategoryManager = ({ categories, loading, onEdit, onDelete, onAdd }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!categories?.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-3xl">🏷️</span>
        </div>
        <p className="text-gray-500">No categories found</p>
        <button
          onClick={onAdd}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
        >
          + Add Category
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Course Categories</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          <HiPlus size={16} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📁</span>
                  <h4 className="font-semibold text-gray-800">{category.name}</h4>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{category.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{category.courseCount || 0} courses</span>
                  <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(category)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500"
                  title="Edit"
                >
                  <HiPencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="p-2 rounded-lg hover:bg-red-50 transition text-red-500"
                  title="Delete"
                >
                  <HiTrash size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;