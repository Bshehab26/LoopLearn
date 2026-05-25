/**
 * AddCourseWizard.jsx
 * Multi-step course creation wizard (Udemy style)
 * Creates a draft course and redirects to My Courses page
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiSave, HiX } from 'react-icons/hi';
import useCourseWizard from '../hooks/useCourseWizard';
import StepIndicator from '../components/StepIndicator';
import StepBasicInfo from '../components/StepBasicInfo';
import StepCategory from '../components/StepCategory';
import StepDurationWeeks from '../components/StepDurationWeeks';
import { createDraftCourse } from '../utils/courseStorage';

const STEPS_LIST = [1, 2, 3];

const AddCourseWizard = () => {
  const navigate = useNavigate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const {
    currentStep,
    courseData,
    errors,
    isSubmitting,
    setIsSubmitting,
    titleLength,
    isTitleValid,
    STEPS,
    STEP_NAMES,
    STEP_DESCRIPTIONS,
    nextStep,
    prevStep,
    updateCourseData,
    resetWizard,
  } = useCourseWizard();

  // Handle form submission (create draft course)
  const handleSubmit = async () => {
    if (!courseData.duration) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Create draft course object
    const draftCourse = {
      title: courseData.title,
      category: courseData.category,
      duration: courseData.duration,
      description: '',
      price: 0,
      level: 0,
      avatar: null,
    };
    
    console.log('[AddCourseWizard] Creating draft course:', draftCourse);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save to localStorage
      const newCourse = createDraftCourse(draftCourse);
      
      console.log('[AddCourseWizard] Draft created:', newCourse);
      
      // Navigate to My Courses page to see the new draft
      navigate('/instructor/my-courses', { 
        state: { 
          success: 'Course draft created successfully!',
          courseId: newCourse.id 
        } 
      });
      
    } catch (error) {
      console.error('[AddCourseWizard] Error:', error);
      alert('Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    if (courseData.title || courseData.category) {
      setShowExitConfirm(true);
    } else {
      navigate('/instructor/my-courses');
    }
  };

  const confirmExit = () => {
    resetWizard();
    navigate('/instructor/my-courses');
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
      case STEPS.DURATION:
        return (
          <StepDurationWeeks
            selectedDuration={courseData.duration}
            onDurationChange={(value) => updateCourseData('duration', value)}
            error={errors.duration}
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
      case STEPS.DURATION:
        return !courseData.duration;
      default:
        return false;
    }
  };

  const isCreateDisabled = () => {
    return !courseData.title.trim() || 
           !courseData.category || 
           !courseData.duration ||
           titleLength < 10 ||
           isSubmitting;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition"
          >
            <HiX size={20} />
            <span>Exit</span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Create New Course</h1>
            <p className="text-sm text-gray-500 mt-1">{STEP_DESCRIPTIONS[currentStep]}</p>
          </div>
          <div className="w-16" />
        </div>
        
        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          steps={STEPS_LIST}
          stepNames={STEP_NAMES}
        />
        
        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all
              ${currentStep === 1 
                ? 'opacity-50 cursor-not-allowed text-gray-400' 
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <HiArrowLeft size={18} />
            Back
          </button>
          
          {currentStep === 3 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isCreateDisabled()}
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Draft...
                </>
              ) : (
                <>
                  <HiSave size={18} />
                  Create Draft Course
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={nextStep}
              disabled={isNextDisabled()}
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <HiArrowRight size={18} />
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowExitConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Exit course creation?</h3>
                <p className="text-gray-500 mb-6">
                  Your progress will not be saved. You can always start a new course later.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                  >
                    Continue Editing
                  </button>
                  <button
                    onClick={confirmExit}
                    className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Exit Anyway
                  </button>
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