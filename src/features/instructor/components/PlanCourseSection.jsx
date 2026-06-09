// src/features/instructor/components/PlanCourseSection.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiTrash, HiClipboardList, HiCheckCircle, HiUsers } from 'react-icons/hi';
import SectionHeader from './SectionHeader';

const PlanCourseSection = ({ data, onUpdate, isEditable, isExpanded, onToggle }) => {
  // Remove the internal useState for isOpen, use the prop instead
  const isOpen = isExpanded;

  const addItem = (field, emptyItem) => {
    onUpdate({ [field]: [...(data[field] || []), { ...emptyItem, id: Date.now() }] });
  };
  
  const updateItem = (field, id, newVal) => {
    const updated = (data[field] || []).map(item => item.id === id ? { ...item, text: newVal.text } : item);
    onUpdate({ [field]: updated });
  };
  
  const deleteItem = (field, id) => {
    const updated = (data[field] || []).filter(item => item.id !== id);
    onUpdate({ [field]: updated });
  };

  const renderTextList = (field, label, placeholder, minItems = 0, icon = null) => (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-gray-800">{label}</h4>
          {minItems > 0 && <p className="text-xs text-gray-500 mt-1">At least {minItems} required</p>}
        </div>
        {isEditable && (
          <button 
            onClick={() => addItem(field, { text: '' })} 
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition"
          >
            <HiPlus size={14} /> Add
          </button>
        )}
      </div>
      <div className="space-y-3">
        {(data[field] || []).map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition">
            {icon && <div className="flex-shrink-0 mt-1">{icon}</div>}
            <textarea
              value={item.text}
              onChange={(e) => updateItem(field, item.id, { text: e.target.value })}
              placeholder={placeholder}
              rows={2}
              disabled={!isEditable}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none text-sm disabled:bg-gray-100"
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <SectionHeader 
        icon={HiClipboardList} 
        title="Plan Your Course" 
        subtitle="Define learning outcomes, requirements, and target audience"
        isOpen={isOpen} 
        onToggle={onToggle}
        badge="Required"
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 space-y-6">
              {renderTextList('learningObjectives', 'What will students learn?', 'e.g., "Build full-stack applications with React"', 4, <HiCheckCircle size={18} className="text-green-500" />)}
              {renderTextList('requirements', 'Requirements / prerequisites', 'e.g., "Basic JavaScript knowledge"', 0, null)}
              {renderTextList('targetAudience', 'Who is this course for?', 'e.g., "Beginner developers"', 0, <HiUsers size={18} className="text-purple-500" />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanCourseSection;