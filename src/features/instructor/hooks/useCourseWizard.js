/**
 * useCourseWizard.js
 * Hook for managing multi-step course creation wizard state
 */

import { useState, useCallback } from 'react';

// ============================================================================
// Constants
// ============================================================================

const STEPS = {
  BASIC_INFO: 1,
  CATEGORY: 2,
  DURATION: 3,
};

const STEP_NAMES = {
  1: 'Basic Information',
  2: 'Choose Category',
  3: 'Course Duration',
};

const STEP_DESCRIPTIONS = {
  1: 'Start with a great title that describes your course',
  2: 'Select the category that best fits your course',
  3: 'Help students know the time commitment',
};

// ============================================================================
// Hook
// ============================================================================

const useCourseWizard = () => {
  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------
  const [currentStep, setCurrentStep] = useState(STEPS.BASIC_INFO);
  const [courseData, setCourseData] = useState({
    title: '',
    category: '',
    duration: 10, // default 5-10 hours (most popular)
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --------------------------------------------------------------------------
  // Step Validation
  // --------------------------------------------------------------------------

  const validateBasicInfo = useCallback(() => {
    const newErrors = {};
    const trimmedTitle = courseData.title.trim();
    
    if (!trimmedTitle) {
      newErrors.title = 'Course title is required';
    } else if (trimmedTitle.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    } else if (trimmedTitle.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [courseData.title]);

  const validateCategory = useCallback(() => {
    const newErrors = {};
    
    if (!courseData.category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [courseData.category]);

  const validateDuration = useCallback(() => {
    const newErrors = {};
    
    if (!courseData.duration || courseData.duration <= 0) {
      newErrors.duration = 'Please select a duration';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [courseData.duration]);

  // --------------------------------------------------------------------------
  // Navigation
  // --------------------------------------------------------------------------

  const nextStep = useCallback(() => {
    let isValid = false;
    
    switch (currentStep) {
      case STEPS.BASIC_INFO:
        isValid = validateBasicInfo();
        break;
      case STEPS.CATEGORY:
        isValid = validateCategory();
        break;
      case STEPS.DURATION:
        isValid = validateDuration();
        break;
      default:
        isValid = true;
    }
    
    if (isValid && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      return true;
    }
    
    return false;
  }, [currentStep, validateBasicInfo, validateCategory, validateDuration]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const updateCourseData = useCallback((field, value) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const resetWizard = useCallback(() => {
    setCurrentStep(STEPS.BASIC_INFO);
    setCourseData({
      title: '',
      category: '',
      duration: 10,
    });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  // --------------------------------------------------------------------------
  // Helper values
  // --------------------------------------------------------------------------
  const titleLength = courseData.title.length;
  const isTitleValid = titleLength >= 10 && titleLength <= 100;

  // --------------------------------------------------------------------------
  // Return
  // --------------------------------------------------------------------------
  return {
    // State
    currentStep,
    courseData,
    errors,
    isSubmitting,
    setIsSubmitting,
    titleLength,
    isTitleValid,
    
    // Constants
    STEPS,
    STEP_NAMES,
    STEP_DESCRIPTIONS,
    
    // Methods
    nextStep,
    prevStep,
    updateCourseData,
    resetWizard,
    validateBasicInfo,
    validateCategory,
    validateDuration,
  };
};

export default useCourseWizard;