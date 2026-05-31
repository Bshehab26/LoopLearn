/**
 * useCourseWizard.js
 * Hook for managing multi-step course creation wizard (2 steps only)
 */

import { useState, useCallback } from 'react';
import { createCourse } from '../api/instructor.api';

const STEPS = {
  BASIC_INFO: 1,
  CATEGORY: 2,
};

const STEP_NAMES = {
  1: 'Basic Information',
  2: 'Choose Category',
};

const STEP_DESCRIPTIONS = {
  1: 'Start with a great title for your course',
  2: 'Select the category that best fits your course',
};

const useCourseWizard = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.BASIC_INFO);
  const [courseData, setCourseData] = useState({
    title: '',
    category: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step Validation
  const validateBasicInfo = useCallback(() => {
    const newErrors = {};
    const trimmedTitle = courseData.title.trim();
    
    if (!trimmedTitle) {
      newErrors.title = 'Course title is required';
    } else if (trimmedTitle.length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
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

  // Navigation
  const nextStep = useCallback(async () => {
    let isValid = false;
    
    switch (currentStep) {
      case STEPS.BASIC_INFO:
        isValid = validateBasicInfo();
        break;
      case STEPS.CATEGORY:
        isValid = validateCategory();
        break;
      default:
        isValid = true;
    }
    
    if (isValid && currentStep < 2) {
      setCurrentStep(prev => prev + 1);
      return true;
    }
    
    return false;
  }, [currentStep, validateBasicInfo, validateCategory]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const updateCourseData = useCallback((field, value) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const createNewCourse = useCallback(async () => {
    if (!validateCategory()) return false;
    
    setIsSubmitting(true);
    
    try {
      const response = await createCourse({
        title: courseData.title.trim(),
        category: courseData.category,
      });
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setErrors({ submit: response.message });
        return { success: false, error: response.message };
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to create course' });
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [courseData, validateCategory]);

  const resetWizard = useCallback(() => {
    setCurrentStep(STEPS.BASIC_INFO);
    setCourseData({ title: '', category: '' });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const titleLength = courseData.title.length;
  const isTitleValid = titleLength >= 2 && titleLength <= 100;

  return {
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
    validateBasicInfo,
    validateCategory,
  };
};

export default useCourseWizard;