// src/features/instructor/components/QuizEditor.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronUp, HiChevronDown, HiTrash, HiPlus, HiAcademicCap, HiExclamationCircle, HiCheckCircle } from 'react-icons/hi';
import QuestionEditor from './QuestionEditor';

const QuizEditor = ({ quiz, onUpdate, onDelete, isEditable }) => {
  const [isOpen, setIsOpen] = useState(true);

  const questions = quiz.questions || [];

  const addQuestion = () => {
    const newQuestion = { 
      id: Date.now(), 
      body: '', 
      points: 1, 
      options: [
        { id: Date.now() + 1, body: '', isCorrect: false },
        { id: Date.now() + 2, body: '', isCorrect: false }
      ] 
    };
    onUpdate({ ...quiz, questions: [...questions, newQuestion] });
  };

  const updateQuestion = (idx, updated) => {
    const newQuestions = [...questions];
    newQuestions[idx] = updated;
    onUpdate({ ...quiz, questions: newQuestions });
  };

  const deleteQuestion = (idx) => {
    const newQuestions = questions.filter((_, i) => i !== idx);
    onUpdate({ ...quiz, questions: newQuestions });
  };

  // Calculate quiz stats
  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
  const questionsWithAnswers = questions.filter(q => 
    q.options?.some(opt => opt.isCorrect)
  ).length;
  const isComplete = questions.length > 0 && questionsWithAnswers === questions.length;

  return (
    <div className={`border-2 rounded-xl mb-4 overflow-hidden transition-all ${
      isComplete ? 'border-green-200' : 'border-purple-200'
    }`}>
      {/* Quiz Header */}
      <div className={`flex items-center justify-between p-4 ${
        isComplete ? 'bg-green-50' : 'bg-purple-50'
      }`}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`p-1 transition flex-shrink-0 ${isComplete ? 'text-green-600' : 'text-purple-600'}`}
          >
            {isOpen ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <HiAcademicCap size={16} className={isComplete ? 'text-green-500' : 'text-purple-500'} />
              <input
                type="text"
                value={quiz.title || ''}
                onChange={(e) => onUpdate({ ...quiz, title: e.target.value })}
                placeholder="Quiz title..."
                disabled={!isEditable}
                className={`flex-1 px-2 py-1 border rounded-lg text-sm font-medium focus:ring-2 outline-none transition disabled:bg-gray-100 ${
                  isComplete 
                    ? 'border-green-200 focus:border-green-500 focus:ring-green-100' 
                    : 'border-purple-200 focus:border-purple-500 focus:ring-purple-100'
                }`}
              />
              {isComplete && (
                <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <HiCheckCircle size={10} />
                  Complete
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{questions.length} question{questions.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{totalPoints} point{totalPoints !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{questionsWithAnswers}/{questions.length} answered</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <div className="text-right">
            <label className="block text-[10px] text-gray-400 mb-0.5">Pass %</label>
            <input
              type="number"
              value={quiz.passingScore || 0}
              onChange={(e) => onUpdate({ ...quiz, passingScore: parseInt(e.target.value) || 0 })}
              disabled={!isEditable}
              min="0"
              max="100"
              className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition disabled:bg-gray-100"
            />
          </div>

          <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer ml-2">
            <input
              type="checkbox"
              checked={quiz.isRequired || false}
              onChange={(e) => onUpdate({ ...quiz, isRequired: e.target.checked })}
              disabled={!isEditable}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            Required
          </label>

          {isEditable && (
            <button 
              onClick={onDelete} 
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
              title="Delete quiz"
            >
              <HiTrash size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Questions Section */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100"
          >
            <div className="p-4 space-y-4">
              {questions.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <HiAcademicCap size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No questions yet</p>
                  <p className="text-xs text-gray-400 mt-1">Add your first question below</p>
                </div>
              )}

              {questions.map((q, idx) => (
                <QuestionEditor
                  key={q.id || idx}
                  question={q}
                  questionIndex={idx}
                  onUpdate={(updated) => updateQuestion(idx, updated)}
                  onDelete={() => deleteQuestion(idx)}
                  isEditable={isEditable}
                />
              ))}

              {isEditable && (
                <button
                  onClick={addQuestion}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-all text-sm font-medium"
                >
                  <HiPlus size={18} />
                  Add Question
                </button>
              )}

              {/* Quiz completion hint */}
              {!isComplete && questions.length > 0 && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center gap-2">
                  <HiExclamationCircle size={16} className="text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    {questions.length - questionsWithAnswers} question{questions.length - questionsWithAnswers !== 1 ? 's' : ''} missing a correct answer. 
                    Click the <strong>circle</strong> next to the correct option for each question.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizEditor;