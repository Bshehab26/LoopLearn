// src/features/instructor/pages/EditCourse.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiSave, HiArrowLeft, HiCheckCircle, HiExclamationCircle, 
  HiPaperAirplane, HiOutlineSave, HiEye
} from 'react-icons/hi';
import { getCourseById, updateCourse, submitForReview } from '../api/instructor.api';
import { mapBackendStatus } from '../utils/courseStatusMapper';
import { toEditableList, fromEditableList, transformBackendSections, transformFrontendSections } from '../utils/courseHelpers';
import CourseStatusBadge from '../components/CourseStatusBadge';
import SubmitForReviewModal from '../components/SubmitForReviewModal';
import CourseValidationErrorsModal from '../components/CourseValidationErrorsModal';
import UnsavedChangesModal from '../../../shared/components/UnsavedChangesModal';
import PlanCourseSection from '../components/PlanCourseSection';
import CourseLandingPageSection from '../components/CourseLandingPageSection';
import PricingSection from '../components/PricingSection';
import CourseStructureSection from '../components/CourseStructureSection/index';
import PromotionsSection from '../components/PromotionsSection';
import CourseMessagesSection from '../components/CourseMessagesSection';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    plan: true,
    landing: true,
    structure: true,
    pricing: true,
    messages: false,
    promotions: false,
  });

  // Load course data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getCourseById(id);
      if (res.success) {
        const data = res.data;
        const transformed = {
          ...data,
          status: mapBackendStatus(data.status),
          requirements: toEditableList(data.requirements),
          learningObjectives: toEditableList(data.learningOutcomes),
          targetAudience: toEditableList(data.targetAudiences),
          sections: transformBackendSections(data.sections),
          subtitle: data.subtitle || '',
          language: data.language || 'en',
          description: data.description || '',
          thumbnailUrl: data.thumbnailUrl || '',
          price: data.price ?? 0,
          isFree: data.isFree ?? false,
          level: data.level || 'Beginner',
          tagIds: data.tagIds || [],
          welcomeMessage: data.welcomeMessage || '',
          completionMessage: data.completionMessage || '',
        };
        setCourse(transformed);
        setHasUnsaved(false);
      } else {
        navigate('/instructor/courses');
      }
      setLoading(false);
    };
    load();
  }, [id, navigate]);

  // Unsaved changes warning on page refresh/browser close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsaved) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsaved]);

  const handleLocalUpdate = useCallback((updates) => {
    setCourse(prev => ({ ...prev, ...updates }));
    setHasUnsaved(true);
  }, []);

// src/features/instructor/pages/EditCourse.jsx - Fix handleSave

const handleSave = async (shouldNavigate = false, navigateTo = null) => {
  if (!course) return;
  setSaving(true);
  setSaveStatus('saving');

  // Debug: Log what we're about to send
  console.log('[Save] Current course data:', {
    subtitle: course.subtitle,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    title: course.title
  });

  const payload = {
    description: course.description,
    thumbnailUrl: course.thumbnailUrl || '',
    subtitle: course.subtitle,        // ✅ Make sure this is included
    language: course.language,
    level: course.level,
    isFree: course.isFree,
    price: course.isFree ? 0 : course.price,
    requirements: fromEditableList(course.requirements),
    learningOutcomes: fromEditableList(course.learningObjectives),
    targetAudiences: fromEditableList(course.targetAudience),
    tagIds: course.tagIds,
    sections: transformFrontendSections(course.sections)
  };

  console.log('[Save] Sending payload:', payload);  // Debug log

  try {
    const response = await updateCourse(id, payload);
    console.log('[Save] Response:', response);  // Debug log
    
    if (response.success) {
      setSaveStatus('saved');
      setHasUnsaved(false);
      
      // Refresh data to confirm subtitle was saved
      const fresh = await getCourseById(id);
      if (fresh.success) {
        const data = fresh.data;
        console.log('[Save] Refreshed course data, subtitle from DB:', data.subtitle);
        
        const transformed = {
          ...data,
          status: mapBackendStatus(data.status),
          requirements: toEditableList(data.requirements),
          learningObjectives: toEditableList(data.learningOutcomes),
          targetAudience: toEditableList(data.targetAudiences),
          sections: transformBackendSections(data.sections),
          subtitle: data.subtitle || '',  // Ensure subtitle is captured
          language: data.language || 'en',
          description: data.description || '',
          thumbnailUrl: data.thumbnailUrl || '',
          price: data.price ?? 0,
          isFree: data.isFree ?? false,
          level: data.level || 'Beginner',
          tagIds: data.tagIds || [],
          welcomeMessage: data.welcomeMessage || '',
          completionMessage: data.completionMessage || '',
        };
        setCourse(transformed);
      }
      
      if (shouldNavigate && navigateTo) {
        navigate(navigateTo);
      }
    } else {
      setSaveStatus('error');
      console.error('Save failed:', response.message);
    }
  } catch (err) {
    setSaveStatus('error');
    console.error('Save error:', err);
  } finally {
    setTimeout(() => setSaveStatus(null), 2000);
    setSaving(false);
  }
};
  // src/features/instructor/pages/EditCourse.jsx - Updated handleSubmitReview

const handleSubmitReview = async () => {
  setSubmitting(true);
  const response = await submitForReview(id);
  
  console.log('[EditCourse] Full submit response:', response);
  console.log('[EditCourse] Response errors:', response.errors);
  console.log('[EditCourse] Response message:', response.message);
  console.log('[EditCourse] Response data:', response.data);
  
  if (response.success) {
    // Success case
    setCourse(prev => ({ ...prev, status: 'pending' }));
    setShowSubmitModal(false);
    navigate('/instructor/courses', { 
      state: { success: response.message || 'Course submitted for review successfully!' } 
    });
  } else {
    // Close the submit modal
    setShowSubmitModal(false);
    
    // Check for validation errors in different possible locations
    let hasErrors = false;
    let errorList = [];
    let errorMessage = response.message || 'Please fix the following issues:';
    
    // Try multiple possible error locations
    if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
      hasErrors = true;
      errorList = response.errors;
    } 
    else if (response.data?.errors && Array.isArray(response.data.errors)) {
      hasErrors = true;
      errorList = response.data.errors;
    }
    else if (response.validationErrors && Array.isArray(response.validationErrors)) {
      hasErrors = true;
      errorList = response.validationErrors;
    }
    else if (typeof response.message === 'string' && response.message.includes('section')) {
      // If message contains error text but no array, create array from message
      hasErrors = true;
      errorList = [response.message];
    }
    
    if (hasErrors && errorList.length > 0) {
      console.log('[EditCourse] Showing validation modal with errors:', errorList);
      setValidationErrors(errorList);
      setValidationMessage(errorMessage);
      setShowValidationErrors(true);
    } else {
      // Fallback - try to extract useful info from response
      console.log('[EditCourse] No structured errors found, raw response:', response);
      
      // If response has a message that looks like validation text
      if (response.message && response.message.length > 10) {
        setValidationErrors([response.message]);
        setValidationMessage('Course validation failed:');
        setShowValidationErrors(true);
      } else {
        // Last resort - show browser alert (but try to be helpful)
        alert(response.message || 'Failed to submit for review. Please check your course content and try again.');
      }
    }
  }
  setSubmitting(false);
};

  const handleNavigation = (path) => {
    if (hasUnsaved) {
      setPendingNavigation(path);
      setShowUnsavedModal(true);
    } else {
      navigate(path);
    }
  };

  const handleDiscardAndNavigate = () => {
    setHasUnsaved(false);
    setShowUnsavedModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleSaveAndNavigate = async () => {
    await handleSave(true, pendingNavigation);
    setShowUnsavedModal(false);
    setPendingNavigation(null);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isEditable = course?.status === 'draft' || course?.status === 'rejected';
  const isPublished = course?.status === 'published';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <button
                  onClick={() => handleNavigation('/instructor/courses')}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3 transition group"
                >
                  <HiArrowLeft size={16} className="group-hover:-translate-x-0.5 transition" />
                  <span className="text-sm">Back to courses</span>
                </button>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-800 line-clamp-1">
                    {course.title}
                  </h1>
                  <CourseStatusBadge status={course.status} showDescription={false} />
                  {hasUnsaved && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      <HiExclamationCircle size={12} />
                      Unsaved changes
                    </span>
                  )}
                </div>
                {isPublished && (
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <HiEye size={14} />
                    This course is live and visible to students
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {isEditable && (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition shadow-sm"
                  >
                    <HiPaperAirplane size={16} />
                    Submit for Review
                  </button>
                )}
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving || !isEditable}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 shadow-sm"
                >
                  {saveStatus === 'saving' && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {saveStatus === 'saved' && <HiCheckCircle size={16} />}
                  {saveStatus === 'error' && <HiExclamationCircle size={16} />}
                  {saveStatus !== 'saving' && saveStatus !== 'saved' && saveStatus !== 'error' && <HiOutlineSave size={16} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                {saveStatus === 'saved' && (
                  <span className="text-xs text-green-600 animate-fade-in">Saved!</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            {/* Progress Indicator */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Course Completion</span>
                <span className="text-purple-600 font-medium">In Progress</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '45%' }} />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Complete all sections to submit for review
              </p>
            </div>

            {/* Plan Course Section */}
            <PlanCourseSection 
              data={course} 
              onUpdate={handleLocalUpdate} 
              isEditable={isEditable}
              isExpanded={expandedSections.plan}
              onToggle={() => toggleSection('plan')}
            />

            {/* Course Landing Page */}
            <CourseLandingPageSection 
              data={course} 
              onUpdate={handleLocalUpdate} 
              isEditable={isEditable}
              isExpanded={expandedSections.landing}
              onToggle={() => toggleSection('landing')}
            />

            {/* Course Structure */}
            <CourseStructureSection 
              data={course} 
              onUpdate={handleLocalUpdate} 
              isEditable={isEditable}
              isExpanded={expandedSections.structure}
              onToggle={() => toggleSection('structure')}
            />

            {/* Pricing */}
            <PricingSection 
              data={course} 
              onUpdate={handleLocalUpdate} 
              isEditable={isEditable}
              isExpanded={expandedSections.pricing}
              onToggle={() => toggleSection('pricing')}
            />

            {/* Course Messages */}
            <CourseMessagesSection 
              data={course} 
              onUpdate={handleLocalUpdate} 
              isEditable={isEditable}
              isExpanded={expandedSections.messages}
              onToggle={() => toggleSection('messages')}
            />

            {/* Promotions */}
            <PromotionsSection 
              isExpanded={expandedSections.promotions}
              onToggle={() => toggleSection('promotions')}
            />
          </div>
        </div>
      </div>

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onConfirm={handleDiscardAndNavigate}
        onSave={handleSaveAndNavigate}
        isSaving={saving}
      />

      {/* Submit for Review Modal */}
      <SubmitForReviewModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmitReview}
        courseTitle={course.title}
        submitting={submitting}
      />

      {/* Validation Errors Modal */}
      <CourseValidationErrorsModal
        isOpen={showValidationErrors}
        onClose={() => setShowValidationErrors(false)}
        errors={validationErrors}
        message={validationMessage}
        courseTitle={course.title}
        courseId={id}
      />
    </>
  );
};

export default EditCourse;