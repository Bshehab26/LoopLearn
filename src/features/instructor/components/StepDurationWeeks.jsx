/**
 * StepDurationWeeks.jsx
 * Step 3: Duration selection with weeks-based radio options (Udemy style)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineClock, HiOutlineCalendar, HiOutlineVideoCamera } from 'react-icons/hi';

const DURATION_OPTIONS = [
  { 
    value: 2, 
    label: '0-2 hours', 
    description: 'Quick intro or mini-course',
    icon: '⚡',
    weeks: '1-2 weeks',
    lectures: '5-10',
  },
  { 
    value: 5, 
    label: '2-5 hours', 
    description: 'Short course, focused topic',
    icon: '📘',
    weeks: '2-3 weeks',
    lectures: '10-20',
  },
  { 
    value: 10, 
    label: '5-10 hours', 
    description: 'Standard course length - Most popular',
    icon: '📚',
    weeks: '3-4 weeks',
    lectures: '20-40',
    popular: true,
  },
  { 
    value: 20, 
    label: '10-20 hours', 
    description: 'In-depth comprehensive course',
    icon: '🎓',
    weeks: '4-6 weeks',
    lectures: '40-80',
  },
  { 
    value: 40, 
    label: '20+ hours', 
    description: 'Professional certification level',
    icon: '🏆',
    weeks: '8+ weeks',
    lectures: '80+',
  },
];

// Weekly study time estimates (hours per week)
const getWeeklyCommitment = (totalHours, weeks = 4) => {
  const weekly = Math.round(totalHours / weeks);
  if (weekly < 1) return 'Less than 1 hour/week';
  if (weekly === 1) return '1 hour/week';
  return `${weekly} hours/week`;
};

const StepDurationWeeks = ({ selectedDuration, onDurationChange, error }) => {
  const selectedOption = DURATION_OPTIONS.find(opt => opt.value === selectedDuration);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
          <HiOutlineClock size={32} className="text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">How long is your course?</h2>
        <p className="text-gray-500 mt-2">
          Help students understand the time commitment required
        </p>
      </div>
      
      {/* Duration Options */}
      <div className="space-y-3 max-w-2xl mx-auto">
        {DURATION_OPTIONS.map((option) => {
          const isSelected = selectedDuration === option.value;
          
          return (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.01 }}
              onClick={() => onDurationChange(option.value)}
              className={`
                w-full p-5 rounded-xl border-2 transition-all text-left relative
                ${isSelected 
                  ? 'border-purple-500 bg-purple-50 shadow-md' 
                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
                }
              `}
            >
              {option.popular && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Most Popular
                </span>
              )}
              
              <div className="flex items-center gap-4">
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center text-2xl
                  ${isSelected ? 'bg-purple-200' : 'bg-gray-100'}
                `}>
                  {option.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className={`font-semibold text-lg ${isSelected ? 'text-purple-700' : 'text-gray-800'}`}>
                      {option.label}
                    </h3>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{option.description}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <HiOutlineCalendar size={12} />
                      <span>{option.weeks}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <HiOutlineVideoCamera size={12} />
                      <span>{option.lectures} lectures</span>
                    </div>
                  </div>
                </div>
                
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300'}
                `}>
                  {isSelected && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      
      {/* Weekly Commitment Info */}
      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mt-6 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
              <span className="text-xl">📅</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700">Student Commitment Preview</p>
              <p className="text-sm text-gray-600 mt-1">
                Students typically complete a {selectedOption.label.toLowerCase()} course in <strong>{selectedOption.weeks}</strong>.
              </p>
              <p className="text-sm text-gray-600">
                Recommended weekly study time: <strong>{getWeeklyCommitment(selectedOption.value)}</strong>
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Info Box */}
      <div className="max-w-2xl mx-auto mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">💡 Pro tip:</span> Most successful courses are 5-20 hours long.
          Students prefer courses that are comprehensive but not overwhelming. Consider breaking longer courses into multiple parts.
        </p>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </motion.div>
  );
};

export default StepDurationWeeks;