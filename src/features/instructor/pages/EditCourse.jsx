import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiSave, HiArrowLeft, HiCheckCircle, HiExclamationCircle, HiPaperAirplane } from 'react-icons/hi';
import { getCourseById, updateCourse, submitForReview } from '../api/instructor.api';
import { mapBackendStatus } from '../utils/courseStatusMapper';
import { toEditableList, fromEditableList, transformBackendSections, transformFrontendSections } from '../utils/courseHelpers';
import CourseStatusBadge from '../components/CourseStatusBadge';
import SubmitForReviewModal from '../components/SubmitForReviewModal';
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
  const [submitting, setSubmitting] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);

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
      sections: transformBackendSections(data.sections), // this must include duration conversion
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
    console.log('Transformed sections:', transformed.sections); // verify durations are numbers
    setCourse(transformed);
    setHasUnsaved(false);
  } else {
    navigate('/instructor/courses');
  }
  setLoading(false);
};
    load();
  }, [id, navigate]);

  const handleLocalUpdate = useCallback((updates) => {
    setCourse(prev => ({ ...prev, ...updates }));
    setHasUnsaved(true);
  }, []);

const handleSave = async () => {
  if (!course) return;
  setSaving(true);
  setSaveStatus('saving');
  
  const payload = {
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    subtitle: course.subtitle,
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

  try {
    const response = await updateCourse(id, payload);
    if (response.success) {
      setSaveStatus('saved');
      setHasUnsaved(false);
      // Refresh data to get real IDs from server
      const fresh = await getCourseById(id);
      if (fresh.success) {
        const data = fresh.data;
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

  const handleSubmitReview = async () => {
    setSubmitting(true);
    const res = await submitForReview(id);
    if (res.success) {
      setCourse(prev => ({ ...prev, status: 'pending' }));
      setShowSubmitModal(false);
      navigate('/instructor/courses', { state: { success: 'Course submitted for review!' } });
    } else {
      alert(res.message);
    }
    setSubmitting(false);
  };

  const isEditable = course?.status === 'draft' || course?.status === 'rejected';
  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!course) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <button onClick={() => navigate('/instructor/courses')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2"><HiArrowLeft size={16} /> Back to courses</button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
            <CourseStatusBadge status={course.status} />
            {hasUnsaved && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Unsaved changes</span>}
          </div>
        </div>
        <div className="flex gap-3">
          {isEditable && <button onClick={() => setShowSubmitModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-yellow-600 text-white rounded-xl font-medium hover:bg-yellow-700"><HiPaperAirplane size={18} /> Submit for Review</button>}
          <button onClick={handleSave} disabled={saving || !isEditable} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50">
            {saveStatus === 'saving' && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {saveStatus === 'saved' && <HiCheckCircle size={18} />}
            {saveStatus === 'error' && <HiExclamationCircle size={18} />}
            Save
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <PlanCourseSection data={course} onUpdate={handleLocalUpdate} isEditable={isEditable} />
        <CourseLandingPageSection data={course} onUpdate={handleLocalUpdate} isEditable={isEditable} />
        <CourseStructureSection data={course} onUpdate={handleLocalUpdate} isEditable={isEditable} />
        <PricingSection data={course} onUpdate={handleLocalUpdate} isEditable={isEditable} />
        <PromotionsSection />
        <CourseMessagesSection data={course} onUpdate={handleLocalUpdate} isEditable={isEditable} />
      </div>
      <SubmitForReviewModal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} onSubmit={handleSubmitReview} courseTitle={course.title} submitting={submitting} />
    </div>
  );
};

export default EditCourse;