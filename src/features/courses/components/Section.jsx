// src/features/courses/components/Section.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import { formatDuration } from '../../../shared/utils/helpers';

const Section = ({ section, index, isOpen, onToggle, currentItemId, onItemSelect, completedItems }) => {
  const combinedItems = [
    ...section.lessons.map((l) => ({ ...l, type: 'lesson' })),
    ...section.quizzes.map((q) => ({ ...q, type: 'quiz' })),
  ].sort((a, b) => a.order - b.order);

  const completedCount = combinedItems.filter((item) => completedItems.has(item.id)).length;

  const getProgress = (item) => {
    if (item.type === 'lesson') {
      return item.progress?.watchedPercentage || 0;
    } else {
      return item.previousAttempt?.isPassed ? 100 : 0;
    }
  };

  const renderProgressCircle = (item) => {
    const progress = getProgress(item);
    const isCompleted = completedItems.has(item.id);
    const strokeColor = isCompleted ? '#10b981' : '#8b5cf6';
    const circumference = 100.5; // 2 * PI * 16 ≈ 100.53
    const dashArray = `${(progress / 100) * circumference} ${circumference}`;
    return (
      <div className="w-8 h-8 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="transform -rotate-90 w-8 h-8">
          <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="16"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeDasharray={dashArray}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="mb-2 border border-gray-100 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => onToggle(index)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-purple-100 text-purple-600">
            {isOpen ? <HiOutlineChevronUp size={16} /> : <HiOutlineChevronDown size={16} />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">{section.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {combinedItems.length} items • {completedCount} completed
            </p>
          </div>
          <div className="flex items-center gap-2">
            {completedCount > 0 && (
              <div className="w-16 h-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${(completedCount / combinedItems.length) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100"
          >
            <div className="py-2">
              {combinedItems.map((item, idx) => {
                const isActive = currentItemId === item.id;
                const isCompleted = completedItems.has(item.id);
                const isQuiz = item.type === 'quiz';
                const progress = getProgress(item);
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => onItemSelect(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
                      isActive ? 'bg-purple-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {renderProgressCircle(item)}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm truncate ${isActive ? 'text-purple-600 font-medium' : 'text-gray-700'}`}>
                          {item.title}
                        </p>
                        {isQuiz && (
                          <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            Quiz
                          </span>
                        )}
                      </div>
                      {item.duration && !isQuiz && (
                        <p className="text-xs text-gray-400 mt-0.5">{formatDuration(item.duration)}</p>
                      )}
                      {isQuiz && item.totalQuestions && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.totalQuestions} questions</p>
                      )}
                    </div>

                    {item.isPreview && !isQuiz && (
                      <span className="text-xs text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full flex-shrink-0">Preview</span>
                    )}
                    {isQuiz && item.previousAttempt && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                          item.previousAttempt.isPassed
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.previousAttempt.isPassed ? 'Passed' : 'Failed'} ({item.previousAttempt.score}%)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Section;