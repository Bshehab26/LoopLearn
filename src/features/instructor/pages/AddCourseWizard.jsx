/**
 * AddCourseWizard.jsx
 * Multi-step course creation wizard (2 steps: Title + Category)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiSave, HiX } from 'react-icons/hi';
import useCourseWizard from '../hooks/useCourseWizard';
import StepIndicator from '../components/StepIndicator';
import StepBasicInfo from '../components/StepBasicInfo';
import StepCategory from '../components/StepCategory';

const STEPS_LIST = [1, 2];

const AddCourseWizard = () => {
  const navigate = useNavigate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const {
    currentStep,
    courseData,
    errors,
    isSubmitting,
    titleLength,
    isTitleValid,
    STEPS,
    STEP_NAMES,
    STEP_DESCRIPTIONS,
    nextStep,
    prevStep,
    updateCourseData,
    createNewCourse,
    resetWizard,
  } = useCourseWizard();

  const handleSubmit = async () => {
    const result = await createNewCourse();
    
    if (result.success) {
      // ✅ FIXED: Navigate to correct route
      navigate('/instructor/courses', { 
        state: { success: 'Course created successfully! You can now add more details.' } 
      });
    }
  };

  const handleExit = () => {
    if (courseData.title || courseData.category) {
      setShowExitConfirm(true);
    } else {
      navigate('/instructor/courses');
    }
  };

  const confirmExit = () => {
    resetWizard();
    navigate('/instructor/courses');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.BASIC_INFO:
        return (
          <StepBasicInfo
            title={courseData.title}
            onTitleChange={(value) => updateCourseData('title', value)}
            error={errors.title}
          />
        );
      case STEPS.CATEGORY:
        return (
          <StepCategory
            selectedCategory={courseData.category}
            onCategoryChange={(value) => updateCourseData('category', value)}
            error={errors.category}
          />
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case STEPS.BASIC_INFO:
        return !courseData.title.trim() || titleLength < 10;
      case STEPS.CATEGORY:
        return !courseData.category;
      default:
        return false;
    }
  };

  const isCreateDisabled = () => {
    return !courseData.title.trim() || !courseData.category || titleLength < 10 || isSubmitting;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={handleExit} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition">
            <HiX size={20} /><span>Exit</span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Create New Course</h1>
            <p className="text-sm text-gray-500 mt-1">{STEP_DESCRIPTIONS[currentStep]}</p>
          </div>
          <div className="w-16" />
        </div>
        
        <StepIndicator currentStep={currentStep} steps={STEPS_LIST} stepNames={STEP_NAMES} />
        
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>
        
        <div className="flex justify-between mt-8">
          <button onClick={prevStep} disabled={currentStep === 1} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${currentStep === 1 ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}>
            <HiArrowLeft size={18} /> Back
          </button>
          
          {currentStep === 2 ? (
            <button onClick={handleSubmit} disabled={isCreateDisabled()} className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating Course...</> : <><HiSave size={18} /> Create Course</>}
            </button>
          ) : (
            <button onClick={nextStep} disabled={isNextDisabled()} className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Continue <HiArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowExitConfirm(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl p-6 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center"><span className="text-3xl">⚠️</span></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Exit course creation?</h3>
                <p className="text-gray-500 mb-6">Your progress will not be saved.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowExitConfirm(false)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Continue Editing</button>
                  <button onClick={confirmExit} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition">Exit Anyway</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddCourseWizard;