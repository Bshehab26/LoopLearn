/**
 * EditCourse.jsx
 * Course editing page - for building course content
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiSave, HiArrowLeft, HiCheckCircle, HiExclamationCircle,
  HiClipboardList, HiCurrencyDollar, HiMail, HiTruck, HiUsers,
  HiBookOpen, HiLightBulb, HiPaperAirplane, HiChevronDown, HiChevronUp, HiPlus, HiTrash
} from 'react-icons/hi';
import CourseStructureSection from '../components/CourseStructureSection';
import CourseStatusBadge from '../components/CourseStatusBadge';
import SubmitForReviewModal from '../components/SubmitForReviewModal';
import { getCourseById, updateCourse, submitForReview } from '../api/instructor.api';

const SECTIONS = {
  PLAN_COURSE: 'plan',
  LANDING_PAGE: 'landing',
  COURSE_STRUCTURE: 'structure',
  PRICING: 'pricing',
  PROMOTIONS: 'promotions',
  MESSAGES: 'messages',
};

const SECTION_NAMES = {
  [SECTIONS.PLAN_COURSE]: 'Plan Your Course',
  [SECTIONS.LANDING_PAGE]: 'Course Landing Page',
  [SECTIONS.COURSE_STRUCTURE]: 'Course Structure',
  [SECTIONS.PRICING]: 'Pricing',
  [SECTIONS.PROMOTIONS]: 'Promotions & Coupons',
  [SECTIONS.MESSAGES]: 'Course Messages',
};

const SectionHeader = ({ icon: Icon, title, isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
        <Icon size={20} className="text-purple-600" />
      </div>
      <div className="text-left">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500">Manage your course details</p>
      </div>
    </div>
    {isOpen ? <HiChevronUp size={20} className="text-gray-400" /> : <HiChevronDown size={20} className="text-gray-400" />}
  </button>
);

const LearningObjectiveInput = ({ objective, index, onUpdate, onDelete, showDelete }) => {
  const maxLength = 160;
  const [isEditing, setIsEditing] = useState(!objective?.text);
  
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg group">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-xs font-bold mt-1">
        {index + 1}
      </div>
      <div className="flex-1">
        {isEditing ? (
          <textarea
            value={objective?.text || ''}
            onChange={(e) => onUpdate(index, { ...objective, text: e.target.value })}
            placeholder="Example: Define the roles and responsibilities of a project manager"
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none text-sm"
          />
        ) : (
          <p className="text-sm text-gray-700">{objective?.text || 'Click to edit'}</p>
        )}
        <div className="flex justify-between items-center mt-1">
          <span className={`text-xs ${(objective?.text || '').length > maxLength ? 'text-red-500' : 'text-gray-400'}`}>
            {(objective?.text || '').length}/{maxLength}
          </span>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-purple-600 hover:text-purple-700"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>
      {showDelete && (objective?.text || isEditing) && (
        <button
          onClick={() => onDelete(index)}
          className="opacity-0 group-hover:opacity-100 transition p-1 text-red-500 hover:text-red-700"
        >
          <HiTrash size={16} />
        </button>
      )}
    </div>
  );
};

const RequirementInput = ({ requirement, index, onUpdate, onDelete }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group">
    <HiCheckCircle size={18} className="text-green-500 flex-shrink-0" />
    <input
      type="text"
      value={requirement?.text || ''}
      onChange={(e) => onUpdate(index, { ...requirement, text: e.target.value })}
      placeholder="Example: No programming experience needed. You will learn everything you need to know"
      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
    />
    <button
      onClick={() => onDelete(index)}
      className="opacity-0 group-hover:opacity-100 transition p-1 text-red-500 hover:text-red-700"
    >
      <HiTrash size={16} />
    </button>
  </div>
);

const AudienceInput = ({ audience, index, onUpdate, onDelete }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group">
    <HiUsers size={18} className="text-purple-500 flex-shrink-0" />
    <input
      type="text"
      value={audience?.text || ''}
      onChange={(e) => onUpdate(index, { ...audience, text: e.target.value })}
      placeholder="Example: Beginner Python developers curious about data science"
      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
    />
    <button
      onClick={() => onDelete(index)}
      className="opacity-0 group-hover:opacity-100 transition p-1 text-red-500 hover:text-red-700"
    >
      <HiTrash size={16} />
    </button>
  </div>
);

const PlanCourseSection = ({ course, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const objectives = course.learningObjectives || [];
  const requirements = course.requirements || [];
  const audience = course.targetAudience || [];
  
  const addLearningObjective = () => {
    onUpdate({ learningObjectives: [...objectives, { text: '' }] });
  };
  
  const updateObjective = (index, obj) => {
    const newObjectives = [...objectives];
    newObjectives[index] = obj;
    onUpdate({ learningObjectives: newObjectives });
  };
  
  const deleteObjective = (index) => {
    const newObjectives = objectives.filter((_, i) => i !== index);
    onUpdate({ learningObjectives: newObjectives });
  };
  
  const addRequirement = () => {
    onUpdate({ requirements: [...requirements, { text: '' }] });
  };
  
  const updateRequirement = (index, req) => {
    const newRequirements = [...requirements];
    newRequirements[index] = req;
    onUpdate({ requirements: newRequirements });
  };
  
  const deleteRequirement = (index) => {
    const newRequirements = requirements.filter((_, i) => i !== index);
    onUpdate({ requirements: newRequirements });
  };
  
  const addAudience = () => {
    onUpdate({ targetAudience: [...audience, { text: '' }] });
  };
  
  const updateAudienceItem = (index, item) => {
    const newAudience = [...audience];
    newAudience[index] = item;
    onUpdate({ targetAudience: newAudience });
  };
  
  const deleteAudience = (index) => {
    const newAudience = audience.filter((_, i) => i !== index);
    onUpdate({ targetAudience: newAudience });
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <SectionHeader icon={HiClipboardList} title="Plan Your Course" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-100">
            <div className="p-6 space-y-8">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">What will students learn in your course?</h4>
                    <p className="text-sm text-gray-500 mt-1">You must enter at least 4 learning objectives</p>
                  </div>
                  <button onClick={addLearningObjective} className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg">+ Add objective</button>
                </div>
                <div className="space-y-3">
                  {objectives.map((objective, index) => (
                    <LearningObjectiveInput key={index} objective={objective} index={index} onUpdate={updateObjective} onDelete={deleteObjective} showDelete={objectives.length > 4} />
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">Requirements or prerequisites</h4>
                    <p className="text-sm text-gray-500 mt-1">List required skills, experience, tools or equipment</p>
                  </div>
                  <button onClick={addRequirement} className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg">+ Add requirement</button>
                </div>
                <div className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <RequirementInput key={index} requirement={requirement} index={index} onUpdate={updateRequirement} onDelete={deleteRequirement} />
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">Who is this course for?</h4>
                    <p className="text-sm text-gray-500 mt-1">Describe the intended learners</p>
                  </div>
                  <button onClick={addAudience} className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg">+ Add audience</button>
                </div>
                <div className="space-y-3">
                  {audience.map((item, index) => (
                    <AudienceInput key={index} audience={item} index={index} onUpdate={updateAudienceItem} onDelete={deleteAudience} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CourseLandingPageSection = ({ course, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <SectionHeader icon={HiBookOpen} title="Course Landing Page" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-100">
            <div className="p-6 space-y-6">
              <div>
                <label className="block font-semibold text-gray-800 mb-2">Course Description</label>
                <textarea value={course.description || ''} onChange={(e) => onUpdate({ description: e.target.value })} rows={6} placeholder="Write a compelling course description..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none" />
              </div>
              <div>
                <label className="block font-semibold text-gray-800 mb-2">Course Thumbnail</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition cursor-pointer">
                  {course.thumbnailUrl || course.avatar ? (
                    <div className="relative inline-block">
                      <img src={course.thumbnailUrl || course.avatar} alt="Course thumbnail" className="w-48 h-32 object-cover rounded-lg" />
                      <button onClick={() => onUpdate({ thumbnailUrl: null })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"><HiTrash size={14} /></button>
                    </div>
                  ) : (
                    <>
                      <HiLightBulb size={40} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload a course thumbnail</p>
                      <p className="text-xs text-gray-400 mt-1">Recommended: 1280x720px, JPG or PNG</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PricingSection = ({ course, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const priceOptions = [19.99, 29.99, 49.99, 69.99, 99.99, 199.99];
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <SectionHeader icon={HiCurrencyDollar} title="Pricing" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-100">
            <div className="p-6">
              <label className="block font-semibold text-gray-800 mb-2">Course Price (USD)</label>
              <div className="flex flex-wrap gap-3 mb-4">
                {priceOptions.map((price) => (
                  <button key={price} onClick={() => onUpdate({ price })} className={`px-5 py-2 rounded-full border transition ${course.price === price ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300 text-gray-700 hover:border-purple-400'}`}>${price}</button>
                ))}
              </div>
              <div className="mt-4">
                <input type="number" value={course.price || ''} onChange={(e) => onUpdate({ price: parseFloat(e.target.value) || 0 })} placeholder="Custom price" className="w-48 px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-400 outline-none" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PromotionsSection = ({ course, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', expiresAt: '' });
  const coupons = course.coupons || [];
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <SectionHeader icon={HiTruck} title="Promotions & Coupons" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-100">
            <div className="p-6 space-y-6">
              {coupons.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Active Coupons</h4>
                  <div className="space-y-2">
                    {coupons.map((coupon) => (
                      <div key={coupon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div><span className="font-mono font-semibold text-purple-600">{coupon.code}</span><span className="ml-2 text-sm text-gray-500">{coupon.discount}% off</span></div>
                        <button onClick={() => onUpdate({ coupons: coupons.filter(c => c.id !== coupon.id) })} className="text-red-500 hover:text-red-700"><HiTrash size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CourseMessagesSection = ({ course, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <SectionHeader icon={HiMail} title="Course Messages" isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-100">
            <div className="p-6 space-y-6">
              <div>
                <label className="block font-semibold text-gray-800 mb-2">Welcome Message</label>
                <textarea value={course.welcomeMessage || ''} onChange={(e) => onUpdate({ welcomeMessage: e.target.value })} rows={3} placeholder="Message students see when they join..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none" />
              </div>
              <div>
                <label className="block font-semibold text-gray-800 mb-2">Completion Message</label>
                <textarea value={course.completionMessage || ''} onChange={(e) => onUpdate({ completionMessage: e.target.value })} rows={3} placeholder="Message students see when they complete..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      const response = await getCourseById(id);
      if (response.success) {
        setCourse(response.data);
      } else {
        navigate('/instructor/courses');
      }
      setLoading(false);
    };
    loadCourse();
  }, [id, navigate]);

  const handleUpdate = async (updates) => {
    if (!course) return;
    setCourse(prev => ({ ...prev, ...updates }));
    setSaving(true);
    setSaveStatus('saving');
    
    const response = await updateCourse(id, updates);
    if (response.success) {
      setSaveStatus('saved');
    } else {
      setSaveStatus('error');
    }
    setTimeout(() => setSaveStatus(null), 2000);
    setSaving(false);
  };

  const handleSaveAll = async () => {
    if (!course) return;
    setSaving(true);
    setSaveStatus('saving');
    
    const response = await updateCourse(id, course);
    if (response.success) {
      setSaveStatus('saved');
    } else {
      setSaveStatus('error');
    }
    setTimeout(() => setSaveStatus(null), 2000);
    setSaving(false);
  };

  const handleSubmitForReview = async () => {
    setSubmitting(true);
    const response = await submitForReview(id);
    if (response.success) {
      setCourse(prev => ({ ...prev, status: 'pending' }));
      setShowSubmitModal(false);
      navigate('/instructor/courses', { state: { success: 'Course submitted for review!' } });
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  // ✅ FOR TESTING: Allow editing of ALL courses regardless of status
  // Change this back to: course.status === 'draft' || course.status === 'rejected' when done testing
  const isEditable = true; // ✅ Allows editing any course for testing

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <button onClick={() => navigate('/instructor/courses')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2 transition">
            <HiArrowLeft size={16} /> Back to courses
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
            <CourseStatusBadge status={course.status} />
          </div>
        </div>
        
        <div className="flex gap-3">
          {/* Only show submit button for draft or rejected courses */}
          {(course.status === 'draft' || course.status === 'rejected') && (
            <button onClick={() => setShowSubmitModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-yellow-600 text-white rounded-xl font-medium hover:bg-yellow-700 transition">
              <HiPaperAirplane size={18} /> Submit for Review
            </button>
          )}
          
          {/* Save button always visible for testing */}
          <button onClick={handleSaveAll} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50">
            {saveStatus === 'saving' && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {saveStatus === 'saved' && <HiCheckCircle size={18} />}
            {saveStatus === 'error' && <HiExclamationCircle size={18} />}
            Save
          </button>
        </div>
      </div>
      
      {/* Always show edit form for testing */}
      <div className="space-y-4">
        <PlanCourseSection course={course} onUpdate={handleUpdate} />
        <CourseLandingPageSection course={course} onUpdate={handleUpdate} />
        <CourseStructureSection course={course} onUpdate={handleUpdate} />
        <PricingSection course={course} onUpdate={handleUpdate} />
        <PromotionsSection course={course} onUpdate={handleUpdate} />
        <CourseMessagesSection course={course} onUpdate={handleUpdate} />
      </div>

      <SubmitForReviewModal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} onSubmit={handleSubmitForReview} courseTitle={course.title} submitting={submitting} />
    </div>
  );
};

export default EditCourse;