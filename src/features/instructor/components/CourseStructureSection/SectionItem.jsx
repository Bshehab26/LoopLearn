import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronUp, HiChevronDown, HiPencil, HiOutlineArrowUp, HiOutlineArrowDown, HiTrash, HiPlus } from 'react-icons/hi';
import LessonItem from './LessonItem';
import QuizEditor from './QuizEditor';

const SectionItem = ({ section, onUpdate, onDelete, onMoveUp, onMoveDown, isEditable }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleEdit, setTitleEdit] = useState(section.title);
  const [newLesson, setNewLesson] = useState({ title: '', videoUrl: '', duration: 0, isPreview: false });
  const [newQuiz, setNewQuiz] = useState({ title: '', description: '', passingScore: 70, isRequired: true, questions: [] });

  const lessons = (section.items || []).filter(item => item.type === 'Lesson').map(item => item.lesson);
  const quizzes = (section.items || []).filter(item => item.type === 'Quiz').map(item => item.quiz);

  const updateLesson = (lessonId, updatedLesson) => {
    const newItems = (section.items || []).map(item =>
      item.type === 'Lesson' && item.lesson.id === lessonId ? { type: 'Lesson', lesson: updatedLesson } : item
    );
    onUpdate({ ...section, items: newItems });
  };
  const deleteLesson = (lessonId) => {
    const newItems = (section.items || []).filter(item => !(item.type === 'Lesson' && item.lesson.id === lessonId));
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
      description: '',
      videoUrl: newLesson.videoUrl,
      order: lessons.length,
      isPreview: newLesson.isPreview,
      duration: newLesson.duration
    };
    const newItems = [...(section.items || []), { type: 'Lesson', lesson: newLessonObj }];
    onUpdate({ ...section, items: newItems });
    setNewLesson({ title: '', videoUrl: '', duration: 0, isPreview: false });
  };
  const updateQuiz = (quizId, updatedQuiz) => {
    const newItems = (section.items || []).map(item =>
      item.type === 'Quiz' && item.quiz.id === quizId ? { type: 'Quiz', quiz: updatedQuiz } : item
    );
    onUpdate({ ...section, items: newItems });
  };
  const deleteQuiz = (quizId) => {
    const newItems = (section.items || []).filter(item => !(item.type === 'Quiz' && item.quiz.id === quizId));
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
    setNewQuiz({ title: '', description: '', passingScore: 70, isRequired: true, questions: [] });
  };
  const saveTitle = () => {
    if (titleEdit.trim()) onUpdate({ ...section, title: titleEdit });
    setIsEditingTitle(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500">{isOpen ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}</button>
          {isEditingTitle ? (
            <div className="flex gap-2 flex-1">
              <input value={titleEdit} onChange={(e) => setTitleEdit(e.target.value)} className="flex-1 px-3 py-1 border rounded-lg text-sm" autoFocus />
              <button onClick={saveTitle} className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">Save</button>
              <button onClick={() => { setTitleEdit(section.title); setIsEditingTitle(false); }} className="px-3 py-1 border rounded-lg text-sm">Cancel</button>
            </div>
          ) : (
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{section.title}</h4>
              <div className="text-xs text-gray-500">{lessons.length} lessons • {quizzes.length} quizzes</div>
            </div>
          )}
        </div>
        {isEditable && !isEditingTitle && (
          <div className="flex gap-1">
            <button onClick={() => setIsEditingTitle(true)} className="p-1 text-gray-500 hover:text-purple-600"><HiPencil size={14} /></button>
            <button onClick={onMoveUp} className="p-1 text-gray-500 hover:text-purple-600"><HiOutlineArrowUp size={14} /></button>
            <button onClick={onMoveDown} className="p-1 text-gray-500 hover:text-purple-600"><HiOutlineArrowDown size={14} /></button>
            <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-600"><HiTrash size={14} /></button>
          </div>
        )}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="p-4 space-y-4">
            <div>
              <div className="font-medium text-gray-700 mb-2">Lessons</div>
              {lessons.map((lesson) => (
                <LessonItem key={lesson.id} lesson={lesson} onUpdate={(updated) => updateLesson(lesson.id, updated)} onDelete={() => deleteLesson(lesson.id)} onMoveUp={() => moveLesson(lesson.id, -1)} onMoveDown={() => moveLesson(lesson.id, 1)} isEditable={isEditable} />
              ))}
              {isEditable && (
                <div className="mt-3 p-3 border-2 border-dashed border-gray-200 rounded-lg">
                  <input type="text" placeholder="Lesson title" value={newLesson.title} onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })} className="w-full mb-2 px-3 py-2 border rounded-lg text-sm" />
                  <div className="flex gap-2 mb-2">
                    <input type="text" placeholder="Video URL" value={newLesson.videoUrl} onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                    <input type="number" placeholder="Minutes" value={newLesson.duration} onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) || 0 })} className="w-24 px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <label className="flex items-center gap-2 mb-2">
                    <input type="checkbox" checked={newLesson.isPreview} onChange={(e) => setNewLesson({ ...newLesson, isPreview: e.target.checked })} />
                    <span className="text-sm">Preview lesson</span>
                  </label>
                  <button onClick={addLesson} className="text-sm text-purple-600 hover:bg-purple-50 px-3 py-1 rounded-lg">+ Add Lesson</button>
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-700 mb-2">Quizzes</div>
              {quizzes.map((quiz) => (
                <QuizEditor key={quiz.id} quiz={quiz} onUpdate={(updated) => updateQuiz(quiz.id, updated)} onDelete={() => deleteQuiz(quiz.id)} isEditable={isEditable} />
              ))}
              {isEditable && (
                <div className="mt-3 p-3 border-2 border-dashed border-gray-200 rounded-lg">
                  <input type="text" placeholder="Quiz title" value={newQuiz.title} onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })} className="w-full mb-2 px-3 py-2 border rounded-lg text-sm" />
                  <textarea placeholder="Description" value={newQuiz.description} onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })} rows={2} className="w-full mb-2 px-3 py-2 border rounded-lg text-sm" />
                  <div className="flex gap-3 mb-2">
                    <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={newQuiz.isRequired} onChange={(e) => setNewQuiz({ ...newQuiz, isRequired: e.target.checked })} /> Required</label>
                    <input type="number" placeholder="Passing Score %" value={newQuiz.passingScore} onChange={(e) => setNewQuiz({ ...newQuiz, passingScore: parseInt(e.target.value) || 0 })} className="w-32 px-2 py-1 border rounded text-sm" />
                  </div>
                  <button onClick={addQuiz} className="text-sm text-purple-600 hover:bg-purple-50 px-3 py-1 rounded-lg">+ Add Quiz</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SectionItem;