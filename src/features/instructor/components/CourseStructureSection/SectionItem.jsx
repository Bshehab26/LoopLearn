// src/features/instructor/components/SectionItem.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiChevronUp, HiChevronDown, HiPencil, HiOutlineArrowUp, 
  HiOutlineArrowDown, HiTrash, HiPlus, HiBookOpen, 
  HiVideoCamera, HiAcademicCap, HiX, HiCheckCircle
} from 'react-icons/hi';
import LessonItem from './LessonItem';
import QuizEditor from './QuizEditor';

const SectionItem = ({ section, onUpdate, onDelete, onMoveUp, onMoveDown, isEditable }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleEdit, setTitleEdit] = useState(section.title);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [showAddQuiz, setShowAddQuiz] = useState(false);

  const [newLesson, setNewLesson] = useState({ 
    title: '', videoUrl: '', duration: 0, isPreview: false, description: '' 
  });
  const [newQuiz, setNewQuiz] = useState({ 
    title: '', description: '', passingScore: 70, isRequired: true 
  });

  const lessons = (section.items || []).filter(item => item.type === 'Lesson').map(item => item.lesson);
  const quizzes = (section.items || []).filter(item => item.type === 'Quiz').map(item => item.quiz);

  // Lesson handlers
  const updateLesson = (lessonId, updatedLesson) => {
    const newItems = (section.items || []).map(item =>
      item.type === 'Lesson' && item.lesson.id === lessonId 
        ? { type: 'Lesson', lesson: updatedLesson } 
        : item
    );
    onUpdate({ ...section, items: newItems });
  };

  const deleteLesson = (lessonId) => {
    const newItems = (section.items || []).filter(
      item => !(item.type === 'Lesson' && item.lesson.id === lessonId)
    );
    onUpdate({ ...section, items: newItems });
  };

  const moveLesson = (lessonId, direction) => {
    const items = [...(section.items || [])];
    const idx = items.findIndex(i => i.type === 'Lesson' && i.lesson.id === lessonId);
    if (idx === -1) return;
    const newIdx = idx + direction;
    if (newIdx >= 0 && newIdx < items.length) {
      [items[idx], items[newIdx]] = [items[newIdx], items[idx]];
      onUpdate({ ...section, items });
    }
  };

  const addLesson = () => {
    if (!newLesson.title.trim()) return;
    const newLessonObj = {
      id: Date.now(),
      title: newLesson.title,
      description: newLesson.description,
      videoUrl: newLesson.videoUrl,
      order: lessons.length,
      isPreview: newLesson.isPreview,
      duration: newLesson.duration
    };
    const newItems = [...(section.items || []), { type: 'Lesson', lesson: newLessonObj }];
    onUpdate({ ...section, items: newItems });
    setNewLesson({ title: '', videoUrl: '', duration: 0, isPreview: false, description: '' });
    setShowAddLesson(false);
  };

  // Quiz handlers
  const updateQuiz = (quizId, updatedQuiz) => {
    const newItems = (section.items || []).map(item =>
      item.type === 'Quiz' && item.quiz.id === quizId 
        ? { type: 'Quiz', quiz: updatedQuiz } 
        : item
    );
    onUpdate({ ...section, items: newItems });
  };

  const deleteQuiz = (quizId) => {
    const newItems = (section.items || []).filter(
      item => !(item.type === 'Quiz' && item.quiz.id === quizId)
    );
    onUpdate({ ...section, items: newItems });
  };

  const addQuiz = () => {
    if (!newQuiz.title.trim()) return;
    const newQuizObj = {
      id: Date.now(),
      title: newQuiz.title,
      description: newQuiz.description,
      passingScore: newQuiz.passingScore,
      isRequired: newQuiz.isRequired,
      questions: []
    };
    const newItems = [...(section.items || []), { type: 'Quiz', quiz: newQuizObj }];
    onUpdate({ ...section, items: newItems });
    setNewQuiz({ title: '', description: '', passingScore: 70, isRequired: true });
    setShowAddQuiz(false);
  };

  const saveTitle = () => {
    if (titleEdit.trim()) onUpdate({ ...section, title: titleEdit });
    setIsEditingTitle(false);
  };

  const sectionDuration = lessons.reduce((sum, l) => sum + (l.duration || 0), 0);

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-200 transition-all shadow-sm">
      {/* Section Header */}
      <div className="bg-gray-50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-1 text-gray-500 hover:text-purple-600 transition flex-shrink-0"
          >
            {isOpen ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
          </button>

          {isEditingTitle ? (
            <div className="flex gap-2 flex-1">
              <input 
                value={titleEdit} 
                onChange={(e) => setTitleEdit(e.target.value)} 
                className="flex-1 px-3 py-1.5 border-2 border-purple-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-100"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
              />
              <button 
                onClick={saveTitle} 
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
              >
                <HiCheckCircle size={16} />
              </button>
              <button 
                onClick={() => { setTitleEdit(section.title); setIsEditingTitle(false); }} 
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition"
              >
                <HiX size={16} />
              </button>
            </div>
          ) : (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-800">{section.title}</h4>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {sectionDuration > 0 ? `${Math.floor(sectionDuration / 60)}h ${sectionDuration % 60}m` : '0m'}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <HiVideoCamera size={12} />
                  {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <HiAcademicCap size={12} />
                  {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''}
                </span>
              </div>
            </div>
          )}
        </div>

        {isEditable && !isEditingTitle && (
          <div className="flex gap-1 flex-shrink-0">
            <button 
              onClick={() => setIsEditingTitle(true)} 
              className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
              title="Edit title"
            >
              <HiPencil size={14} />
            </button>
            <button 
              onClick={onMoveUp} 
              className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
              title="Move up"
            >
              <HiOutlineArrowUp size={14} />
            </button>
            <button 
              onClick={onMoveDown} 
              className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
              title="Move down"
            >
              <HiOutlineArrowDown size={14} />
            </button>
            <button 
              onClick={onDelete} 
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete section"
            >
              <HiTrash size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Section Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: 'auto' }} 
            exit={{ height: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-4 space-y-5">
              {/* Lessons */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <HiVideoCamera size={16} className="text-purple-500" />
                    Lessons
                  </h5>
                  {isEditable && !showAddLesson && (
                    <button
                      onClick={() => setShowAddLesson(true)}
                      className="text-xs text-purple-600 hover:bg-purple-50 px-2 py-1 rounded-lg transition flex items-center gap-1"
                    >
                      <HiPlus size={12} />
                      Add Lesson
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {lessons.map((lesson) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      onUpdate={(updated) => updateLesson(lesson.id, updated)}
                      onDelete={() => deleteLesson(lesson.id)}
                      onMoveUp={() => moveLesson(lesson.id, -1)}
                      onMoveDown={() => moveLesson(lesson.id, 1)}
                      isEditable={isEditable}
                    />
                  ))}
                </div>

                {/* Add Lesson Form */}
                {isEditable && showAddLesson && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-4 bg-purple-50 rounded-xl border-2 border-purple-200"
                  >
                    <h6 className="text-sm font-medium text-purple-800 mb-3">New Lesson</h6>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Lesson title *"
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Video URL (YouTube/Vimeo)"
                          value={newLesson.videoUrl}
                          onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Min"
                          value={newLesson.duration}
                          onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) || 0 })}
                          min="0"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                        />
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newLesson.isPreview}
                          onChange={(e) => setNewLesson({ ...newLesson, isPreview: e.target.checked })}
                          className="w-4 h-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Free preview lesson</span>
                      </label>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowAddLesson(false)}
                          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={addLesson}
                          disabled={!newLesson.title.trim()}
                          className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-medium"
                        >
                          Add Lesson
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Quizzes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <HiAcademicCap size={16} className="text-purple-500" />
                    Quizzes
                  </h5>
                  {isEditable && !showAddQuiz && (
                    <button
                      onClick={() => setShowAddQuiz(true)}
                      className="text-xs text-purple-600 hover:bg-purple-50 px-2 py-1 rounded-lg transition flex items-center gap-1"
                    >
                      <HiPlus size={12} />
                      Add Quiz
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {quizzes.map((quiz) => (
                    <QuizEditor
                      key={quiz.id}
                      quiz={quiz}
                      onUpdate={(updated) => updateQuiz(quiz.id, updated)}
                      onDelete={() => deleteQuiz(quiz.id)}
                      isEditable={isEditable}
                    />
                  ))}
                </div>

                {/* Add Quiz Form */}
                {isEditable && showAddQuiz && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-4 bg-purple-50 rounded-xl border-2 border-purple-200"
                  >
                    <h6 className="text-sm font-medium text-purple-800 mb-3">New Quiz</h6>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Quiz title *"
                        value={newQuiz.title}
                        onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                      />
                      <textarea
                        placeholder="Description (optional)"
                        value={newQuiz.description}
                        onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
                      />
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newQuiz.isRequired}
                            onChange={(e) => setNewQuiz({ ...newQuiz, isRequired: e.target.checked })}
                            className="w-4 h-4 text-purple-600 rounded"
                          />
                          <span className="text-sm text-gray-700">Required</span>
                        </label>
                        <input
                          type="number"
                          placeholder="Passing %"
                          value={newQuiz.passingScore}
                          onChange={(e) => setNewQuiz({ ...newQuiz, passingScore: parseInt(e.target.value) || 0 })}
                          min="0"
                          max="100"
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowAddQuiz(false)}
                          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={addQuiz}
                          disabled={!newQuiz.title.trim()}
                          className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-medium"
                        >
                          Add Quiz
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SectionItem;