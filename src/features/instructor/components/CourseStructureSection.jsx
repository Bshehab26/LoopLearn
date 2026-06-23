// src/features/instructor/components/CourseStructureSection.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBookOpen, HiPlus, HiChevronUp, HiChevronDown, HiLightBulb } from 'react-icons/hi';
import SectionItem from './CourseStructureSection/SectionItem';

const CourseStructureSection = ({ data, onUpdate, isEditable }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const sections = data?.sections ?? [];

  const addSection = () => {
    if (!newSectionTitle.trim()) return;
    const newSection = { 
      id: Date.now(), 
      title: newSectionTitle, 
      order: sections.length, 
      items: [] 
    };
    onUpdate({ sections: [...sections, newSection] });
    setNewSectionTitle('');
  };

  const updateSection = (idx, updated) => {
    const newSections = [...sections];
    newSections[idx] = updated;
    onUpdate({ sections: newSections });
  };

  const deleteSection = (idx) => {
    const newSections = sections.filter((_, i) => i !== idx);
    onUpdate({ sections: newSections });
  };

  const moveSection = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= sections.length) return;
    const newSections = [...sections];
    [newSections[idx], newSections[target]] = [newSections[target], newSections[idx]];
    onUpdate({ sections: newSections });
  };

  const totalLessons = sections.reduce((sum, sec) => 
    sum + (sec.items?.filter(i => i.type === 'Lesson').length || 0), 0);
  const totalQuizzes = sections.reduce((sum, sec) => 
    sum + (sec.items?.filter(i => i.type === 'Quiz').length || 0), 0);
  const totalDuration = sections.reduce((sum, sec) => 
    sum + (sec.items?.filter(i => i.type === 'Lesson').reduce((s, l) => s + (l.lesson?.duration || 0), 0) || 0), 0);

  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
  };

  const hasContent = totalLessons > 0 || totalQuizzes > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <HiBookOpen size={20} className="text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Course Structure</h3>
              <p className="text-xs text-gray-500">Organize your content into sections and lessons</p>
            </div>
          </div>
          {isOpen ? <HiChevronUp size={20} className="text-gray-400" /> : <HiChevronDown size={20} className="text-gray-400" />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {/* Stats Cards */}
              <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-xs text-gray-500">Sections</p>
                  <p className="text-2xl font-bold text-purple-600">{sections.length}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-gray-500">Lessons</p>
                  <p className="text-2xl font-bold text-blue-600">{totalLessons}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <p className="text-xs text-gray-500">Quizzes</p>
                  <p className="text-2xl font-bold text-green-600">{totalQuizzes}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-xs text-gray-500">Total Duration</p>
                  <p className="text-2xl font-bold text-amber-600">{formatDuration(totalDuration)}</p>
                </div>
              </div>

              {/* Tips for empty state */}
              {!hasContent && isEditable && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3">
                  <HiLightBulb size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Getting Started</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Create a section (e.g., "Introduction"), then add lessons with video content. 
                      You can also add quizzes to test student knowledge.
                    </p>
                  </div>
                </div>
              )}

              {/* Sections List */}
              <div className="space-y-4 mb-6">
                {sections.map((sec, idx) => (
                  <SectionItem
                    key={sec.id}
                    section={sec}
                    onUpdate={(updated) => updateSection(idx, updated)}
                    onDelete={() => deleteSection(idx)}
                    onMoveUp={() => moveSection(idx, -1)}
                    onMoveDown={() => moveSection(idx, 1)}
                    isEditable={isEditable}
                  />
                ))}
              </div>

              {/* Add Section */}
              {isEditable && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-purple-400 transition-colors">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSection()}
                      placeholder="New section title (e.g., Introduction, Chapter 1)"
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                    />
                    <button
                      onClick={addSection}
                      disabled={!newSectionTitle.trim()}
                      className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-medium"
                    >
                      <HiPlus size={18} /> Add Section
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CourseStructureSection;