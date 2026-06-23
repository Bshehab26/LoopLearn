// src/features/instructor/components/QuestionEditor.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronUp, HiChevronDown, HiTrash, HiPlus, HiQuestionMarkCircle, HiExclamationCircle } from 'react-icons/hi';
import OptionEditor from './OptionEditor';

const QuestionEditor = ({ question, onUpdate, onDelete, isEditable, questionIndex }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [correctOptionId, setCorrectOptionId] = useState(() => {
    // Find the currently correct option
    const correct = (question.options || []).find(opt => opt.isCorrect);
    return correct?.id || null;
  });

  const options = question.options || [];

  const addOption = () => {
    const newOption = { id: Date.now(), body: '', isCorrect: false };
    const newOptions = [...options, newOption];
    onUpdate({ ...question, options: newOptions });
  };

  const updateOption = (idx, updated) => {
    const newOptions = [...options];
    newOptions[idx] = updated;
    onUpdate({ ...question, options: newOptions });
  };

  const deleteOption = (idx) => {
    const deletedOption = options[idx];
    const newOptions = options.filter((_, i) => i !== idx);

    // If we deleted the correct answer, clear it
    if (deletedOption.id === correctOptionId) {
      setCorrectOptionId(null);
    }

    onUpdate({ ...question, options: newOptions });
  };

  const handleSelectCorrect = (optionId) => {
    setCorrectOptionId(optionId);

    // Update all options: only the selected one is correct
    const newOptions = options.map(opt => ({
      ...opt,
      isCorrect: opt.id === optionId
    }));

    onUpdate({ ...question, options: newOptions });
  };

  const hasCorrectAnswer = correctOptionId !== null && options.some(opt => opt.id === correctOptionId && opt.isCorrect);
  const minOptions = 2;
  const canAddMore = options.length < 6;
  const canDelete = options.length > minOptions;

  return (
    <div className={`border-2 rounded-xl mb-4 overflow-hidden transition-all ${
      hasCorrectAnswer ? 'border-green-200' : 'border-gray-200'
    }`}>
      {/* Question Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-1 text-gray-500 hover:text-purple-600 transition flex-shrink-0"
          >
            {isOpen ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <HiQuestionMarkCircle size={16} className="text-purple-500 flex-shrink-0" />
              <span className="text-xs text-gray-400 font-medium">Question {questionIndex + 1}</span>
              {!hasCorrectAnswer && isEditable && (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                  <HiExclamationCircle size={10} />
                  Select correct answer
                </span>
              )}
              {hasCorrectAnswer && (
                <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full font-medium">
                  ✓ Has answer
                </span>
              )}
            </div>
            <input
              type="text"
              value={question.body || ''}
              onChange={(e) => onUpdate({ ...question, body: e.target.value })}
              placeholder="Enter your question..."
              disabled={!isEditable}
              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm font-medium focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <div className="text-right">
            <label className="block text-[10px] text-gray-400 mb-0.5">Points</label>
            <input
              type="number"
              value={question.points || 0}
              onChange={(e) => onUpdate({ ...question, points: parseInt(e.target.value) || 0 })}
              disabled={!isEditable}
              min="0"
              max="100"
              className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition disabled:bg-gray-100"
            />
          </div>
          {isEditable && (
            <button 
              onClick={onDelete} 
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
              title="Delete question"
            >
              <HiTrash size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Options Section */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100"
          >
            <div className="p-4 space-y-3">
              {/* Options List */}
              <div className="space-y-3">
                {options.map((opt, idx) => (
                  <OptionEditor
                    key={opt.id || idx}
                    option={opt}
                    index={idx}
                    onUpdate={(updated) => updateOption(idx, updated)}
                    onDelete={() => canDelete && deleteOption(idx)}
                    isEditable={isEditable}
                    isCorrect={opt.id === correctOptionId}
                    onSelectCorrect={handleSelectCorrect}
                  />
                ))}
              </div>

              {/* Add Option Button */}
              {isEditable && canAddMore && (
                <button
                  onClick={addOption}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all text-sm font-medium"
                >
                  <HiPlus size={16} />
                  Add Option ({options.length}/6)
                </button>
              )}

              {/* Max options reached */}
              {options.length >= 6 && (
                <p className="text-xs text-gray-400 text-center">Maximum 6 options reached</p>
              )}

              {/* Minimum options warning */}
              {options.length < minOptions && (
                <p className="text-xs text-amber-600 text-center bg-amber-50 p-2 rounded-lg">
                  Add at least {minOptions} options
                </p>
              )}

              {/* Correct answer hint */}
              {!hasCorrectAnswer && options.length >= minOptions && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center gap-2">
                  <HiExclamationCircle size={16} className="text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    Click the <strong>circle</strong> next to an option to mark it as the correct answer.
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

export default QuestionEditor;