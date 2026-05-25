/**
 * CourseStructureSection.jsx
 * Course structure section for managing chapters and lessons
 * Allows instructors to organize course content with sections and lessons
 * 
 * @module features/instructor/components/CourseStructureSection
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiChevronDown, HiChevronUp, HiPlus, HiTrash, HiPencil,
  HiOutlineDocumentText, HiOutlineVideoCamera, HiOutlineClock,
  HiOutlineDuplicate, HiOutlineArrowUp, HiOutlineArrowDown,
  HiDotsVertical, HiOutlineLink
} from 'react-icons/hi';

// ============================================================================
// Helper Components
// ============================================================================

const SectionHeader = ({ icon: Icon, title, isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
        <Icon size={20} className="text-purple-600" />
      </div>
      <div className="text-left">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500">Organize your course content</p>
      </div>
    </div>
    {isOpen ? <HiChevronUp size={20} className="text-gray-400" /> : <HiChevronDown size={20} className="text-gray-400" />}
  </button>
);

const LessonItem = ({ lesson, index, sectionIndex, onUpdate, onDelete, onMoveUp, onMoveDown }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLesson, setEditedLesson] = useState(lesson);
  
  const handleSave = () => {
    if (editedLesson.title.trim()) {
      onUpdate(editedLesson);
      setIsEditing(false);
    }
  };
  
  const formatDuration = (minutes) => {
    if (!minutes) return '0:00';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}`;
    }
    return `${minutes}:00`;
  };
  
  if (isEditing) {
    return (
      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="space-y-3">
          <input
            type="text"
            value={editedLesson.title}
            onChange={(e) => setEditedLesson({ ...editedLesson, title: e.target.value })}
            placeholder="Lesson title"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={editedLesson.videoUrl || ''}
              onChange={(e) => setEditedLesson({ ...editedLesson, videoUrl: e.target.value })}
              placeholder="Video URL (YouTube, Vimeo, etc.)"
              className="px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
            />
            <input
              type="number"
              value={editedLesson.duration || ''}
              onChange={(e) => setEditedLesson({ ...editedLesson, duration: parseInt(e.target.value) || 0 })}
              placeholder="Duration (minutes)"
              className="px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Save Lesson
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition">
      <div className="flex-shrink-0 w-6 text-center">
        <HiOutlineVideoCamera size={16} className="text-gray-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">{index + 1}.</span>
          <span className="text-sm text-gray-700">{lesson.title}</span>
        </div>
        {lesson.videoUrl && (
          <div className="flex items-center gap-2 mt-1">
            <HiOutlineLink size={12} className="text-gray-400" />
            <span className="text-xs text-gray-400 truncate max-w-xs">{lesson.videoUrl}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <HiOutlineClock size={12} />
          <span>{formatDuration(lesson.duration)}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-500 hover:text-purple-600 transition"
            title="Edit lesson"
          >
            <HiPencil size={14} />
          </button>
          <button
            onClick={onMoveUp}
            className="p-1 text-gray-500 hover:text-purple-600 transition"
            title="Move up"
          >
            <HiOutlineArrowUp size={14} />
          </button>
          <button
            onClick={onMoveDown}
            className="p-1 text-gray-500 hover:text-purple-600 transition"
            title="Move down"
          >
            <HiOutlineArrowDown size={14} />
          </button>
          <button
            onClick={() => onDelete()}
            className="p-1 text-gray-500 hover:text-red-600 transition"
            title="Delete lesson"
          >
            <HiTrash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionItem = ({ section, index, onUpdate, onDelete, onMoveUp, onMoveDown }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [editedTitle, setEditedTitle] = useState(section.title);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonUrl, setNewLessonUrl] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('');
  
  const addLesson = () => {
    if (newLessonTitle.trim()) {
      const newLesson = {
        id: Date.now(),
        title: newLessonTitle,
        videoUrl: newLessonUrl,
        duration: parseInt(newLessonDuration) || 0,
      };
      onUpdate({
        ...section,
        lessons: [...(section.lessons || []), newLesson]
      });
      setNewLessonTitle('');
      setNewLessonUrl('');
      setNewLessonDuration('');
    }
  };
  
  const updateLesson = (lessonIndex, updatedLesson) => {
    const newLessons = [...(section.lessons || [])];
    newLessons[lessonIndex] = updatedLesson;
    onUpdate({ ...section, lessons: newLessons });
  };
  
  const deleteLesson = (lessonIndex) => {
    const newLessons = (section.lessons || []).filter((_, i) => i !== lessonIndex);
    onUpdate({ ...section, lessons: newLessons });
  };
  
  const moveLesson = (lessonIndex, direction) => {
    const newLessons = [...(section.lessons || [])];
    const targetIndex = lessonIndex + direction;
    if (targetIndex >= 0 && targetIndex < newLessons.length) {
      [newLessons[lessonIndex], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[lessonIndex]];
      onUpdate({ ...section, lessons: newLessons });
    }
  };
  
  const saveTitle = () => {
    if (editedTitle.trim()) {
      onUpdate({ ...section, title: editedTitle });
      setIsEditing(false);
    }
  };
  
  const totalDuration = (section.lessons || []).reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
  const formatTotalDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} hr ${mins} min`;
    }
    return `${mins} min`;
  };
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Section Header */}
      <div className="bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isOpen ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
            </button>
            
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                  autoFocus
                />
                <button
                  onClick={saveTitle}
                  className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditedTitle(section.title);
                    setIsEditing(false);
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{section.title}</h4>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500">
                      {(section.lessons || []).length} lessons
                    </span>
                    {totalDuration > 0 && (
                      <span className="text-xs text-gray-500">
                        • {formatTotalDuration(totalDuration)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-gray-500 hover:text-purple-600 transition"
                    title="Edit section"
                  >
                    <HiPencil size={14} />
                  </button>
                  <button
                    onClick={onMoveUp}
                    className="p-1 text-gray-500 hover:text-purple-600 transition"
                    title="Move section up"
                  >
                    <HiOutlineArrowUp size={14} />
                  </button>
                  <button
                    onClick={onMoveDown}
                    className="p-1 text-gray-500 hover:text-purple-600 transition"
                    title="Move section down"
                  >
                    <HiOutlineArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => onDelete()}
                    className="p-1 text-gray-500 hover:text-red-600 transition"
                    title="Delete section"
                  >
                    <HiTrash size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Section Content - Lessons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 space-y-2">
              {/* Lessons List */}
              {(section.lessons || []).map((lesson, lessonIndex) => (
                <LessonItem
                  key={lesson.id || lessonIndex}
                  lesson={lesson}
                  index={lessonIndex}
                  sectionIndex={index}
                  onUpdate={(updated) => updateLesson(lessonIndex, updated)}
                  onDelete={() => deleteLesson(lessonIndex)}
                  onMoveUp={() => moveLesson(lessonIndex, -1)}
                  onMoveDown={() => moveLesson(lessonIndex, 1)}
                />
              ))}
              
              {/* Add Lesson Form */}
              <div className="mt-3 p-3 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="New lesson title"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newLessonUrl}
                      onChange={(e) => setNewLessonUrl(e.target.value)}
                      placeholder="Video URL (optional)"
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                    />
                    <input
                      type="number"
                      value={newLessonDuration}
                      onChange={(e) => setNewLessonDuration(e.target.value)}
                      placeholder="Duration (minutes)"
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                    />
                  </div>
                  <button
                    onClick={addLesson}
                    disabled={!newLessonTitle.trim()}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition disabled:opacity-50"
                  >
                    <HiPlus size={14} />
                    Add Lesson
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const CourseStructureSection = ({ course, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  
  const sections = course.courseContent || [];
  
  const addSection = () => {
    if (newSectionTitle.trim()) {
      const newSection = {
        id: Date.now(),
        title: newSectionTitle,
        lessons: [],
      };
      onUpdate({ courseContent: [...sections, newSection] });
      setNewSectionTitle('');
    }
  };
  
  const updateSection = (index, updatedSection) => {
    const newSections = [...sections];
    newSections[index] = updatedSection;
    onUpdate({ courseContent: newSections });
  };
  
  const deleteSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    onUpdate({ courseContent: newSections });
  };
  
  const moveSection = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < sections.length) {
      const newSections = [...sections];
      [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
      onUpdate({ courseContent: newSections });
    }
  };
  
  const getTotalDuration = () => {
    let total = 0;
    sections.forEach(section => {
      (section.lessons || []).forEach(lesson => {
        total += lesson.duration || 0;
      });
    });
    return total;
  };
  
  const getTotalLessons = () => {
    return sections.reduce((sum, section) => sum + (section.lessons || []).length, 0);
  };
  
  const formatTotalDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} hr ${mins} min`;
    }
    return `${mins} min`;
  };
  
  const totalDuration = getTotalDuration();
  const totalLessons = getTotalLessons();
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <SectionHeader
        icon={HiOutlineDocumentText}
        title="Course Structure"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100"
          >
            <div className="p-6">
              {/* Course Statistics */}
              <div className="mb-6 p-4 bg-purple-50 rounded-xl">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-xs text-gray-500">Total Sections</p>
                    <p className="text-2xl font-bold text-purple-600">{sections.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Lessons</p>
                    <p className="text-2xl font-bold text-purple-600">{totalLessons}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Duration</p>
                    <p className="text-2xl font-bold text-purple-600">{formatTotalDuration(totalDuration)}</p>
                  </div>
                </div>
              </div>
              
              {/* Sections List */}
              <div className="space-y-4 mb-6">
                {sections.map((section, index) => (
                  <SectionItem
                    key={section.id || index}
                    section={section}
                    index={index}
                    onUpdate={(updated) => updateSection(index, updated)}
                    onDelete={() => deleteSection(index)}
                    onMoveUp={() => moveSection(index, -1)}
                    onMoveDown={() => moveSection(index, 1)}
                  />
                ))}
              </div>
              
              {/* Add Section Form */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="New section title (e.g., Introduction, Chapter 1, etc.)"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                  />
                  <button
                    onClick={addSection}
                    disabled={!newSectionTitle.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    <HiPlus size={18} />
                    Add Section
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Organize your course into sections. Each section can contain multiple lessons.
                </p>
              </div>
              
              {/* Tips Section */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700 font-medium mb-2">📖 Tips for structuring your course:</p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Start with an introduction section explaining what students will learn</li>
                  <li>• Break complex topics into smaller, digestible lessons</li>
                  <li>• Include practical examples and hands-on exercises</li>
                  <li>• Add a conclusion section with next steps and additional resources</li>
                  <li>• Keep lessons under 15 minutes for better engagement</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseStructureSection;