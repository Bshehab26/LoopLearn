// src/features/instructor/pages/EditCourse.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiCheckCircle, HiExclamationCircle, HiOutlineSave
} from 'react-icons/hi';
import { getCourseById, updateCourse, submitForReview } from '../api/instructor.api';
import { mapBackendStatus } from '../utils/courseStatusMapper';
import { 
  toEditableList, 
  fromEditableList,
  transformBackendSections, 
  transformFrontendSections,
  transformBackendTags,
  prepareCourseSavePayload 
} from '../utils/courseHelpers';
import CourseStatusBadge from '../components/CourseStatusBadge';
import EditCourseSidebar from '../components/EditCourseSidebar';
import SubmitForReviewModal from '../components/SubmitForReviewModal';
import CourseValidationErrorsModal from '../components/CourseValidationErrorsModal';
import UnsavedChangesModal from '../../../shared/components/UnsavedChangesModal';
import TitleCategorySection from '../components/TitleCategorySection';
import PlanCourseSection from '../components/PlanCourseSection';
import CourseLandingPageSection from '../components/CourseLandingPageSection';
import CourseStructureSection from '../components/CourseStructureSection';
import PricingSection from '../components/PricingSection';

const SECTIONS = {
  'title-category': TitleCategorySection,
  'plan': PlanCourseSection,
  'landing': CourseLandingPageSection,
  'structure': CourseStructureSection,
  'pricing': PricingSection,
};

const SECTION_ORDER = ['title-category', 'plan', 'landing', 'structure', 'pricing'];

const SECTION_LABELS = {
  'title-category': 'Title & Category',
  'plan': 'Plan Your Course',
  'landing': 'Course Landing Page',
  'structure': 'Course Structure',
  'pricing': 'Pricing',
};

const SECTION_DESCRIPTIONS = {
  'title-category': 'Edit your course name and category',
  'plan': 'Define what students will learn',
  'landing': 'Set up your course thumbnail and description',
  'structure': 'Organize your content into sections',
  'pricing': 'Set the right price for your course',
};

// Check if a section is complete
const getSectionStatus = (sectionId, course) => {
  if (!course) return 'incomplete';
  switch (sectionId) {
    case 'title-category':
      return course.title?.trim() && course.category ? 'complete' : 'incomplete';
    case 'plan':
      return (course.learningObjectives?.length >= 1) ? 'complete' : 'incomplete';
    case 'landing':
      return (course.description?.length > 50 && course.thumbnailUrl) ? 'complete' : 'incomplete';
    case 'structure':
      return (course.sections?.length > 0 && course.sections.some(s => s.items?.some(i => i.type === 'Lesson')))
        ? 'complete' : 'incomplete';
    case 'pricing':
      return (course.isFree !== undefined && (course.isFree || course.price >= 0)) ? 'complete' : 'incomplete';
    default:
      return 'incomplete';
  }
};

// Get the first uncompleted section
const getFirstUncompletedSection = (course) => {
  if (!course) return 'title-category';
  for (const sectionId of SECTION_ORDER) {
    if (getSectionStatus(sectionId, course) === 'incomplete') {
      return sectionId;
    }
  }
  // All complete, return the first section
  return SECTION_ORDER[0];
};

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mainContentRef = useRef(null);
  
  // Store the last saved tags locally to preserve them when backend doesn't return them
  const lastSavedTagsRef = useRef({ tagIds: [], tags: [] });

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [activeSection, setActiveSection] = useState('title-category');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationMessage, setValidationMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Load course data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getCourseById(id);
        if (res.success && res.data) {
          const data = res.data;
          console.log('[EditCourse] Loaded course data:', {
            tagIds: data.tagIds,
            tags: data.tags,
            title: data.title,
            status: data.status
          });

          // Use the working status mapper from the second version
          const mappedStatus = mapBackendStatus(data.status);
          console.log(`[EditCourse] Raw backend status: ${JSON.stringify(data.status)} -> mapped: "${mappedStatus}"`);

          // Guard against direct URL access: only draft/rejected courses are editable
          if (mappedStatus !== 'draft' && mappedStatus !== 'rejected') {
            console.warn(`[EditCourse] Course status "${mappedStatus}" is not editable. Redirecting.`);
            setLoading(false);
            navigate('/instructor/courses', {
              replace: true,
              state: { error: 'This course can no longer be edited because of its current status.' },
            });
            return;
          }

          const tags = transformBackendTags(data.tags, data.tagIds);

          const transformed = {
            ...data,
            status: mappedStatus,
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
            tags: tags,
            welcomeMessage: data.welcomeMessage || '',
            completionMessage: data.completionMessage || '',
          };
          setCourse(transformed);

          // Auto-select first uncompleted section on load
          const firstUncompleted = getFirstUncompletedSection(transformed);
          setActiveSection(firstUncompleted);

          setHasUnsaved(false);
        } else {
          navigate('/instructor/courses');
        }
      } catch (err) {
        console.error('[EditCourse] Failed to load course:', err);
        navigate('/instructor/courses');
      }
      setLoading(false);
    };
    load();
  }, [id, navigate]);

  // Browser beforeunload handler (tab close, refresh)
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

  // Intercept clicks on <a> and <Link> tags within the app
  useEffect(() => {
    const handleClick = (e) => {
      if (!hasUnsaved) return;

      const link = e.target.closest('a[href], [data-navigate]');
      if (!link) return;

      const href = link.getAttribute('href') || link.dataset.navigate;
      if (!href) return;

      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript')) return;
      if (href === location.pathname) return;

      const isInternalLink = href.startsWith('/') || href.startsWith('.');
      if (!isInternalLink) return;

      e.preventDefault();
      e.stopPropagation();

      setPendingNavigation(href);
      setShowUnsavedModal(true);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [hasUnsaved, location.pathname]);

  // Intercept browser back/forward buttons
  useEffect(() => {
    const handlePopState = (e) => {
      if (hasUnsaved) {
        window.history.pushState(null, '', location.pathname + location.search);
        setPendingNavigation(null);
        setShowUnsavedModal(true);
      }
    };

    if (hasUnsaved) {
      window.history.pushState(null, '', location.pathname + location.search);
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsaved, location.pathname, location.search]);

  const handleLocalUpdate = useCallback((updates, markUnsaved = true) => {
    setCourse(prev => ({ ...prev, ...updates }));
    if (markUnsaved) {
      setHasUnsaved(true);
    }
  }, []);

  // MAIN SAVE: Sends ALL section data at once via PUT
  const handleSave = async (shouldNavigate = false, navigateTo = null) => {
    if (!course) return;
    setSaving(true);
    setSaveStatus('saving');

    // Use the working save payload preparation from the second version
    // Ensure tagIds is an array
    const tagIds = Array.isArray(course.tagIds) ? course.tagIds : [];
    const tags = Array.isArray(course.tags) ? course.tags : [];
    
    console.log('[Save] Tag IDs being sent:', tagIds);
    console.log('[Save] Tags being sent:', tags);

    const payload = {
      description: course.description,
      thumbnailUrl: course.thumbnailUrl || '',
      subtitle: course.subtitle,
      language: course.language,
      level: course.level,
      isFree: course.isFree,
      price: course.isFree ? 0 : course.price,
      requirements: fromEditableList(course.requirements),
      learningOutcomes: fromEditableList(course.learningObjectives),
      targetAudiences: fromEditableList(course.targetAudience),
      tagIds: tagIds,
      sections: transformFrontendSections(course.sections)
    };

    console.log('[Save] Sending payload:', payload);

    try {
      const response = await updateCourse(id, payload);
      console.log('[Save] Response:', response);

      if (response.success) {
        setSaveStatus('saved');
        setHasUnsaved(false);

        // Save the tags locally so we can restore them if backend doesn't return them
        lastSavedTagsRef.current = { tagIds, tags };
        console.log('[Save] Saved tags to ref:', lastSavedTagsRef.current);

        // Refresh data from server
        const fresh = await getCourseById(id);
        if (fresh.success && fresh.data) {
          const data = fresh.data;
          console.log('[Save] Refreshed course data from DB:', {
            tagIds: data.tagIds,
            tags: data.tags,
            subtitle: data.subtitle
          });

          // Use the working status mapper
          const mappedStatus = mapBackendStatus(data.status);
          
          // If backend didn't return tags, restore from our saved ref
          let freshTagIds = data.tagIds || [];
          let freshTags = data.tags || [];
          
          if ((!freshTagIds || freshTagIds.length === 0) && tagIds.length > 0) {
            console.log('[Save] Backend returned no tags, restoring from ref');
            freshTagIds = tagIds;
            freshTags = tags;
          }

          const updatedCourse = {
            ...data,
            status: mappedStatus,
            requirements: toEditableList(data.requirements),
            learningObjectives: toEditableList(data.learningOutcomes),
            targetAudience: toEditableList(data.targetAudiences),
            sections: transformBackendSections(data.sections),
            tags: freshTags.length > 0 ? freshTags : course.tags,
            tagIds: freshTagIds.length > 0 ? freshTagIds : course.tagIds,
          };

          setCourse(updatedCourse);

          // After successful save, auto-select the first uncompleted section
          const firstUncompleted = getFirstUncompletedSection(updatedCourse);
          setActiveSection(firstUncompleted);
        }

        if (shouldNavigate && navigateTo) {
          navigate(navigateTo);
        }
      } else {
        setSaveStatus('error');
        console.error('Save failed:', response.message);
      }
    } catch (err) {
      console.error('[EditCourse] Save error:', err);
      setSaveStatus('error');
    } finally {
      setTimeout(() => setSaveStatus(null), 2000);
      setSaving(false);
    }
  };

  const handleSubmitReview = async () => {
    setSubmitting(true);
    try {
      const response = await submitForReview(id);
      
      console.log('[EditCourse] Full submit response:', response);

      if (response.success) {
        setCourse(prev => ({ ...prev, status: 'pending' }));
        setShowSubmitModal(false);
        navigate('/instructor/courses', { 
          state: { success: response.message || 'Course submitted for review successfully!' } 
        });
      } else {
        setShowSubmitModal(false);

        let hasErrors = false;
        let errorList = [];
        let errorMessage = response.message || 'Please fix the following issues:';

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
          hasErrors = true;
          errorList = [response.message];
        }

        if (hasErrors && errorList.length > 0) {
          console.log('[EditCourse] Showing validation modal with errors:', errorList);
          setValidationErrors(errorList);
          setValidationMessage(errorMessage);
          setShowValidationErrors(true);
        } else {
          console.log('[EditCourse] No structured errors found, raw response:', response);
          if (response.message && response.message.length > 10) {
            setValidationErrors([response.message]);
            setValidationMessage('Course validation failed:');
            setShowValidationErrors(true);
          } else {
            alert(response.message || 'Failed to submit for review. Please check your course content and try again.');
          }
        }
      }
    } catch (err) {
      console.error('[EditCourse] Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle "Back to courses" button click
  const handleNavigation = (path) => {
    if (hasUnsaved) {
      setPendingNavigation(path);
      setShowUnsavedModal(true);
    } else {
      navigate(path);
    }
  };

  // Modal action handlers
  const handleDiscardAndNavigate = () => {
    setHasUnsaved(false);
    setShowUnsavedModal(false);

    if (pendingNavigation) {
      navigate(pendingNavigation);
    }

    setPendingNavigation(null);
  };

  const handleSaveAndNavigate = async () => {
    await handleSave(true, pendingNavigation);
    setShowUnsavedModal(false);
    setPendingNavigation(null);
  };

  const handleKeepEditing = () => {
    setShowUnsavedModal(false);
    setPendingNavigation(null);
  };

  const isEditable = course?.status === 'draft' || course?.status === 'rejected';
  const ActiveSectionComponent = SECTIONS[activeSection];

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* SCROLLABLE MAIN CONTENT */}
      <main className="flex-1 min-h-screen overflow-y-auto mr-80">
        <div className="max-w-3xl mx-auto px-8 py-8 pb-32">
          {/* Section Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              {SECTION_LABELS[activeSection]}
            </h1>
            <p className="text-gray-500 mt-1">
              {SECTION_DESCRIPTIONS[activeSection]}
            </p>
          </div>

          {/* Active Section Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {ActiveSectionComponent && (
                <ActiveSectionComponent
                  data={course}
                  onUpdate={
                    activeSection === 'title-category'
                      ? (updates) => handleLocalUpdate(updates, false)
                      : handleLocalUpdate
                  }
                  isEditable={isEditable}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom spacing for save bar */}
          <div className="h-24" />
        </div>
      </main>

      {/* FIXED RIGHT SIDEBAR */}
      <aside className="w-80 flex-shrink-0 fixed right-0 top-0 h-screen z-20 overflow-hidden border-l border-gray-200">
        <EditCourseSidebar
          course={course}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onSave={() => handleSave(false)}
          onSubmitReview={() => setShowSubmitModal(true)}
          onNavigateBack={() => handleNavigation('/instructor/courses')}
          saving={saving}
          saveStatus={saveStatus}
          hasUnsaved={hasUnsaved}
          isEditable={isEditable}
          getSectionStatus={getSectionStatus}
        />
      </aside>

      {/* UNSAVED CHANGES MODAL */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={handleKeepEditing}
        onConfirm={handleDiscardAndNavigate}
        onSave={handleSaveAndNavigate}
        isSaving={saving}
      />

      <SubmitForReviewModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmitReview}
        courseTitle={course.title}
        submitting={submitting}
      />

      <CourseValidationErrorsModal
        isOpen={showValidationErrors}
        onClose={() => setShowValidationErrors(false)}
        errors={validationErrors}
        message={validationMessage}
        courseTitle={course.title}
        courseId={id}
      />
    </div>
  );
};

export default EditCourse;