// src/features/instructor/components/PlanCourseSection.jsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlus, HiTrash, HiClipboardList, HiCheckCircle, HiUsers, HiAcademicCap } from 'react-icons/hi';

const PlanCourseSection = ({ data, onUpdate, isEditable }) => {
  const [newItem, setNewItem] = useState({ field: '', text: '' });

  const addItem = (field, emptyItem) => {
    const currentList = data[field] || [];
    onUpdate({ 
      [field]: [...currentList, { ...emptyItem, id: Date.now(), text: '' }] 
    });
  };

  const updateItem = (field, id, newText) => {
    const updated = (data[field] || []).map(item => 
      item.id === id ? { ...item, text: newText } : item
    );
    onUpdate({ [field]: updated });
  };

  const deleteItem = (field, id) => {
    const updated = (data[field] || []).filter(item => item.id !== id);
    onUpdate({ [field]: updated });
  };

  const getItemIcon = (field) => {
    switch(field) {
      case 'learningObjectives': return <HiCheckCircle className="text-green-500" size={18} />;
      case 'requirements': return <HiAcademicCap className="text-orange-500" size={18} />;
      case 'targetAudience': return <HiUsers className="text-purple-500" size={18} />;
      default: return null;
    }
  };

  const getPlaceholder = (field) => {
    switch(field) {
      case 'learningObjectives': return 'e.g., "Build full-stack web applications with React and Node.js"';
      case 'requirements': return 'e.g., "Basic understanding of JavaScript"';
      case 'targetAudience': return 'e.g., "Beginner developers who want to learn web development"';
      default: return '';
    }
  };

  const getTitle = (field) => {
    switch(field) {
      case 'learningObjectives': return 'What will students learn?';
      case 'requirements': return 'Requirements / Prerequisites';
      case 'targetAudience': return 'Target Audience';
      default: return '';
    }
  };

  const getDescription = (field) => {
    switch(field) {
      case 'learningObjectives': return 'List 3-5 specific outcomes students will achieve';
      case 'requirements': return 'What knowledge or tools do students need before starting?';
      case 'targetAudience': return 'Who is this course designed for?';
      default: return '';
    }
  };

  const renderSection = (field) => {
    const items = data[field] || [];
    return (
      <div className="bg-gray-50 rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getItemIcon(field)}
              <h3 className="font-medium text-gray-800">{getTitle(field)}</h3>
            </div>
            <p className="text-xs text-gray-500">{getDescription(field)}</p>
          </div>
          {isEditable && (
            <button
              onClick={() => addItem(field, {})}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition"
            >
              <HiPlus size={14} /> Add
            </button>
          )}
        </div>

        <div className="space-y-3">
          {items.length === 0 && (
            <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-sm text-gray-400">No items added yet</p>
              {isEditable && (
                <button
                  onClick={() => addItem(field, {})}
                  className="mt-2 text-purple-600 text-sm hover:underline"
                >
                  + Add your first item
                </button>
              )}
            </div>
          )}

          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 group hover:border-purple-200 transition">
              <div className="flex-shrink-0 mt-1">
                {getItemIcon(field)}
              </div>
              <textarea
                value={item.text}
                onChange={(e) => updateItem(field, item.id, e.target.value)}
                placeholder={getPlaceholder(field)}
                rows={2}
                disabled={!isEditable}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none text-sm disabled:bg-gray-50 disabled:text-gray-500"
              />
              {isEditable && (
                <button
                  onClick={() => deleteItem(field, item.id)}
                  className="opacity-0 group-hover:opacity-100 transition p-1 text-red-500 hover:text-red-700"
                >
                  <HiTrash size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <HiClipboardList size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Plan Your Course</h3>
            <p className="text-xs text-gray-500">Define learning outcomes, requirements, and target audience</p>
          </div>
        </div>

        <div className="space-y-6">
          {renderSection('learningObjectives')}
          {renderSection('requirements')}
          {renderSection('targetAudience')}
        </div>
      </div>
    </motion.div>
  );
};

export default PlanCourseSection;