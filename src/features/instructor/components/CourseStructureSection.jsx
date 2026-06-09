// src/features/instructor/components/CourseStructureSection/index.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBookOpen, HiPlus } from 'react-icons/hi';
import SectionHeader from '../SectionHeader';
import SectionItem from './SectionItem';

const CourseStructureSection = ({ data, onUpdate, isEditable, isExpanded, onToggle }) => {
  const isOpen = isExpanded;
  const [newSectionTitle, setNewSectionTitle] = useState('');

  // Defensive: ensure data and data.sections exist
  const sections = data?.sections ?? [];

  const addSection = () => {
    if (!newSectionTitle.trim()) return;
    const newSection = { id: Date.now(), title: newSectionTitle, order: sections.length, items: [] };
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

  const totalLessons = sections.reduce((sum, sec) => sum + (sec.items?.filter(i => i.type === 'Lesson').length || 0), 0);
  const totalQuizzes = sections.reduce((sum, sec) => sum + (sec.items?.filter(i => i.type === 'Quiz').length || 0), 0);
  const totalDuration = sections.reduce((sum, sec) => sum + (sec.items?.filter(i => i.type === 'Lesson').reduce((s, l) => s + (l.lesson.duration || 0), 0) || 0), 0);

  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <SectionHeader 
        icon={HiBookOpen} 
        title="Course Structure" 
        subtitle="Organize your content into sections and lessons"
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
            <div className="p-6">
              {/* Stats */}
              <div className="mb-6 p-4 bg-purple-50 rounded-xl flex flex-wrap gap-6">
                <div>
                  <p className="text-xs text-gray-500">Sections</p>
                  <p className="text-2xl font-bold text-purple-600">{sections.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lessons</p>
                  <p className="text-2xl font-bold text-purple-600">{totalLessons}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Quizzes</p>
                  <p className="text-2xl font-bold text-purple-600">{totalQuizzes}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Duration</p>
                  <p className="text-2xl font-bold text-purple-600">{formatDuration(totalDuration)}</p>
                </div>
              </div>

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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="New section title (e.g., Introduction, Chapter 1)"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                    />
                    <button
                      onClick={addSection}
                      disabled={!newSectionTitle.trim() || !isEditable}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                    >
                      <HiPlus size={18} /> Add Section
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseStructureSection;