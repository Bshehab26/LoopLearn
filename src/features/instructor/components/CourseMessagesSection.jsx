// src/features/instructor/components/CourseMessagesSection.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMail } from 'react-icons/hi';
import SectionHeader from './SectionHeader';

const CourseMessagesSection = ({ data, onUpdate, isEditable, isExpanded, onToggle }) => {
  const isOpen = isExpanded;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <SectionHeader 
        icon={HiMail} 
        title="Course Messages" 
        subtitle="Welcome and completion messages for students"
        isOpen={isOpen} 
        onToggle={onToggle}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-semibold text-gray-800 mb-2">Welcome Message</label>
                <textarea 
                  value={data.welcomeMessage || ''} 
                  onChange={(e) => onUpdate({ welcomeMessage: e.target.value })} 
                  rows={3} 
                  placeholder="Welcome students to your course! This message will be shown when they first enroll..." 
                  disabled={!isEditable} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none disabled:bg-gray-100"
                />
                <p className="text-xs text-gray-400 mt-1">Personalize the welcome experience for your students</p>
              </div>
              <div>
                <label className="block font-semibold text-gray-800 mb-2">Completion Message</label>
                <textarea 
                  value={data.completionMessage || ''} 
                  onChange={(e) => onUpdate({ completionMessage: e.target.value })} 
                  rows={3} 
                  placeholder="Congratulations! This message will be shown when students complete the course..." 
                  disabled={!isEditable} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none disabled:bg-gray-100"
                />
                <p className="text-xs text-gray-400 mt-1">Celebrate your students' achievement</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseMessagesSection;