import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronUp, HiChevronDown, HiTrash, HiPlus } from 'react-icons/hi';
import QuestionEditor from './QuestionEditor';

const QuizEditor = ({ quiz, onUpdate, onDelete, isEditable }) => {
  const [isOpen, setIsOpen] = useState(true);
  const addQuestion = () => {
    const newQuestion = { id: Date.now(), body: '', points: 1, options: [] };
    onUpdate({ ...quiz, questions: [...(quiz.questions || []), newQuestion] });
  };
  const updateQuestion = (idx, updated) => {
    const newQuestions = [...(quiz.questions || [])];
    newQuestions[idx] = updated;
    onUpdate({ ...quiz, questions: newQuestions });
  };
  const deleteQuestion = (idx) => {
    const newQuestions = (quiz.questions || []).filter((_, i) => i !== idx);
    onUpdate({ ...quiz, questions: newQuestions });
  };

  return (
    <div className="border border-purple-200 rounded-lg mb-3 bg-purple-50/30">
      <div className="flex items-center justify-between p-3 bg-purple-100 rounded-t-lg">
        <button onClick={() => setIsOpen(!isOpen)} className="text-purple-700">{isOpen ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}</button>
        <input type="text" value={quiz.title || ''} onChange={(e) => onUpdate({ ...quiz, title: e.target.value })} placeholder="Quiz title" disabled={!isEditable} className="flex-1 mx-2 px-2 py-1 border rounded text-sm font-medium" />
        <div className="flex gap-2">
          <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={quiz.isRequired || false} onChange={(e) => onUpdate({ ...quiz, isRequired: e.target.checked })} disabled={!isEditable} /> Required</label>
          <input type="number" value={quiz.passingScore || 0} onChange={(e) => onUpdate({ ...quiz, passingScore: parseInt(e.target.value) || 0 })} disabled={!isEditable} className="w-16 px-1 py-1 border rounded text-sm text-center" placeholder="Pass %" />
          {isEditable && <button onClick={onDelete} className="text-red-500"><HiTrash size={16} /></button>}
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="p-3 space-y-3">
            {(quiz.questions || []).map((q, idx) => (
              <QuestionEditor key={q.id || idx} question={q} onUpdate={(updated) => updateQuestion(idx, updated)} onDelete={() => deleteQuestion(idx)} isEditable={isEditable} />
            ))}
            {isEditable && <button onClick={addQuestion} className="text-sm text-purple-600 hover:bg-purple-50 px-2 py-1 rounded">+ Add Question</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizEditor;