/**
 * EditCourse.jsx
 * Udemy-style course management page for editing course content
 * 
 * @module features/instructor/pages/EditCourse
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiSave, HiArrowLeft, HiCheckCircle, HiExclamationCircle,
  HiClipboardList, HiCurrencyDollar,
  HiMail, HiTruck, HiUsers,
  HiBookOpen, HiLightBulb,
  HiChevronDown, HiChevronUp, HiPlus, HiTrash, HiPencil
} from 'react-icons/hi';
import CourseStructureSection from '../components/CourseStructureSection';

// ============================================================================
// Constants
// ============================================================================

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

const SECTION_ICONS = {
  [SECTIONS.PLAN_COURSE]: HiClipboardList,
  [SECTIONS.LANDING_PAGE]: HiBookOpen,
  [SECTIONS.COURSE_STRUCTURE]: HiClipboardList,
  [SECTIONS.PRICING]: HiCurrencyDollar,
  [SECTIONS.PROMOTIONS]: HiTruck,
  [SECTIONS.MESSAGES]: HiMail,
};

// ============================================================================
// Helper Components
// ============================================================================

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

// ============================================================================
// Section Components
// ============================================================================

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
  
  const validObjectives = objectives.filter(o => o.text?.trim()).length;
  const needsMoreObjectives = validObjectives < 4;
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <SectionHeader
        icon={HiClipboardList}
        title="Plan Your Course"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 space-y-8">
              {/* Learning Objectives */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">What will students learn in your course?</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      You must enter at least 4 learning objectives or outcomes
                    </p>
                  </div>
                  <button
                    onClick={addLearningObjective}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition"
                  >
                    <HiPlus size={16} />
                    Add objective
                  </button>
                </div>
                
                <div className="space-y-3">
                  {objectives.map((objective, index) => (
                    <LearningObjectiveInput
                      key={index}
                      objective={objective}
                      index={index}
                      onUpdate={updateObjective}
                      onDelete={deleteObjective}
                      showDelete={objectives.length > 4}
                    />
                  ))}
                  
                  {objectives.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-8">
                      Click "Add objective" to start adding learning outcomes
                    </p>
                  )}
                </div>
                
                {needsMoreObjectives && objectives.length > 0 && (
                  <p className="text-amber-600 text-sm mt-3 flex items-center gap-1">
                    <HiExclamationCircle size={14} />
                    Need at least 4 learning objectives ({validObjectives}/4)
                  </p>
                )}
              </div>
              
              {/* Requirements / Prerequisites */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">What are the requirements or prerequisites?</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      List the required skills, experience, tools or equipment
                    </p>
                  </div>
                  <button
                    onClick={addRequirement}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition"
                  >
                    <HiPlus size={16} />
                    Add requirement
                  </button>
                </div>
                
                <div className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <RequirementInput
                      key={index}
                      requirement={requirement}
                      index={index}
                      onUpdate={updateRequirement}
                      onDelete={deleteRequirement}
                    />
                  ))}
                </div>
              </div>
              
              {/* Target Audience */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">Who is this course for?</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Write a clear description of the intended learners
                    </p>
                  </div>
                  <button
                    onClick={addAudience}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition"
                  >
                    <HiPlus size={16} />
                    Add audience
                  </button>
                </div>
                
                <div className="space-y-3">
                  {audience.map((item, index) => (
                    <AudienceInput
                      key={index}
                      audience={item}
                      index={index}
                      onUpdate={updateAudienceItem}
                      onDelete={deleteAudience}
                    />
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
      <SectionHeader
        icon={HiBookOpen}
        title="Course Landing Page"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 space-y-6">
              {/* Course Description */}
              <div>
                <label className="block font-semibold text-gray-800 mb-2">
                  Course Description
                </label>
                <textarea
                  value={course.description || ''}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  rows={6}
                  placeholder="Write a compelling course description that will attract students..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
                />
                <p className="text-xs text-gray-400 mt-2">
                  {(course.description || '').length}/5000 characters
                </p>
              </div>
              
              {/* Course Image / Thumbnail */}
              <div>
                <label className="block font-semibold text-gray-800 mb-2">
                  Course Thumbnail
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition cursor-pointer">
                  {course.avatar ? (
                    <div className="relative inline-block">
                      <img src={course.avatar} alt="Course thumbnail" className="w-48 h-32 object-cover rounded-lg" />
                      <button
                        onClick={() => onUpdate({ avatar: null })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <HiTrash size={14} />
                      </button>
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
      <SectionHeader
        icon={HiCurrencyDollar}
        title="Pricing"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100"
          >
            <div className="p-6">
              <label className="block font-semibold text-gray-800 mb-2">
                Course Price (USD)
              </label>
              <div className="flex flex-wrap gap-3 mb-4">
                {priceOptions.map((price) => (
                  <button
                    key={price}
                    onClick={() => onUpdate({ price })}
                    className={`px-5 py-2 rounded-full border transition ${
                      course.price === price
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'border-gray-300 text-gray-700 hover:border-purple-400'
                    }`}
                  >
                    ${price}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <input
                  type="number"
                  value={course.price || ''}
                  onChange={(e) => onUpdate({ price: parseFloat(e.target.value) || 0 })}
                  placeholder="Custom price"
                  className="w-48 px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                />
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Your revenue will be calculated based on the sale price.
              </p>
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
  
  const addCoupon = () => {
    if (newCoupon.code && newCoupon.discount) {
      onUpdate({ coupons: [...coupons, { ...newCoupon, id: Date.now() }] });
      setNewCoupon({ code: '', discount: '', expiresAt: '' });
    }
  };
  
  const deleteCoupon = (couponId) => {
    onUpdate({ coupons: coupons.filter(c => c.id !== couponId) });
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <SectionHeader
        icon={HiTruck}
        title="Promotions & Coupons"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 space-y-6">
              {/* Current Coupons */}
              {coupons.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Active Coupons</h4>
                  <div className="space-y-2">
                    {coupons.map((coupon) => (
                      <div key={coupon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-mono font-semibold text-purple-600">{coupon.code}</span>
                          <span className="ml-2 text-sm text-gray-500">{coupon.discount}% off</span>
                          {coupon.expiresAt && (
                            <span className="ml-2 text-xs text-gray-400">Expires: {coupon.expiresAt}</span>
                          )}
                        </div>
                        <button
                          onClick={() => deleteCoupon(coupon.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <HiTrash size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add New Coupon */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Create New Coupon</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <input
                    type="text"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="Coupon code (e.g., SUMMER20)"
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 outline-none"
                  />
                  <input
                    type="number"
                    value={newCoupon.discount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                    placeholder="Discount % (10-90)"
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 outline-none"
                  />
                  <input
                    type="date"
                    value={newCoupon.expiresAt}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-400 outline-none"
                  />
                </div>
                <button
                  onClick={addCoupon}
                  disabled={!newCoupon.code || !newCoupon.discount}
                  className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  <HiPlus size={16} />
                  Add Coupon
                </button>
              </div>
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
      <SectionHeader
        icon={HiMail}
        title="Course Messages"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 space-y-6">
              {/* Welcome Message */}
              <div>
                <label className="block font-semibold text-gray-800 mb-2">
                  Welcome Message
                </label>
                <textarea
                  value={course.welcomeMessage || ''}
                  onChange={(e) => onUpdate({ welcomeMessage: e.target.value })}
                  rows={3}
                  placeholder="Message students see when they first join your course..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  This message will be sent automatically to new students
                </p>
              </div>
              
              {/* Completion Message */}
              <div>
                <label className="block font-semibold text-gray-800 mb-2">
                  Course Completion Message
                </label>
                <textarea
                  value={course.completionMessage || ''}
                  onChange={(e) => onUpdate({ completionMessage: e.target.value })}
                  rows={3}
                  placeholder="Message students see when they complete your course..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  This message will be sent when students complete 100% of your course
                </p>
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
  
  // Load course data
  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      try {
        const courses = JSON.parse(localStorage.getItem('instructor_courses') || '[]');
        const courseData = courses.find(c => c.id === parseInt(id));
        
        if (courseData) {
          setCourse({
            ...courseData,
            learningObjectives: courseData.learningObjectives || [],
            requirements: courseData.requirements || [],
            targetAudience: courseData.targetAudience || [],
            courseContent: courseData.courseContent || [],
            coupons: courseData.coupons || [],
            welcomeMessage: courseData.welcomeMessage || '',
            completionMessage: courseData.completionMessage || '',
          });
        } else {
          navigate('/instructor/my-courses');
        }
      } catch (error) {
        console.error('Error loading course:', error);
        navigate('/instructor/my-courses');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadCourse();
    }
  }, [id, navigate]);
  
  // Handle course updates
  const handleUpdate = async (updates) => {
    if (!course) return;
    
    setCourse(prev => ({ ...prev, ...updates }));
    setSaving(true);
    setSaveStatus('saving');
    
    try {
      const courses = JSON.parse(localStorage.getItem('instructor_courses') || '[]');
      const index = courses.findIndex(c => c.id === parseInt(id));
      if (index !== -1) {
        courses[index] = { ...courses[index], ...updates, updatedAt: new Date().toISOString() };
        localStorage.setItem('instructor_courses', JSON.stringify(courses));
      }
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    } finally {
      setSaving(false);
    }
  };
  
  const handleSaveAll = async () => {
    if (!course) return;
    
    setSaving(true);
    setSaveStatus('saving');
    
    try {
      const courses = JSON.parse(localStorage.getItem('instructor_courses') || '[]');
      const index = courses.findIndex(c => c.id === parseInt(id));
      if (index !== -1) {
        courses[index] = { ...course, updatedAt: new Date().toISOString() };
        localStorage.setItem('instructor_courses', JSON.stringify(courses));
      }
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving all:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    } finally {
      setSaving(false);
    }
  };
  
  const getCompletionPercentage = () => {
    let total = 0;
    let completed = 0;
    
    // Learning objectives (need at least 4)
    total += 4;
    const validObjectives = (course?.learningObjectives || []).filter(o => o.text?.trim()).length;
    completed += Math.min(validObjectives, 4);
    
    // Requirements (at least 1)
    total += 1;
    completed += (course?.requirements || []).filter(r => r.text?.trim()).length >= 1 ? 1 : 0;
    
    // Target audience (at least 1)
    total += 1;
    completed += (course?.targetAudience || []).filter(a => a.text?.trim()).length >= 1 ? 1 : 0;
    
    // Course content (at least 1 section with 1 lesson)
    total += 1;
    const hasContent = (course?.courseContent || []).length > 0 && 
                       (course?.courseContent || []).some(s => (s.lessons || []).length > 0);
    completed += hasContent ? 1 : 0;
    
    // Description
    total += 1;
    completed += course?.description && course.description.length > 50 ? 1 : 0;
    
    // Price
    total += 1;
    completed += course?.price && course.price > 0 ? 1 : 0;
    
    return Math.round((completed / total) * 100);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!course) return null;
  
  const completionPercentage = getCompletionPercentage();
  
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate('/instructor/my-courses')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2 transition"
          >
            <HiArrowLeft size={16} />
            Back to courses
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
              {course.status === 'draft' ? 'DRAFT' : 'PUBLISHED'}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{completionPercentage}% complete</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50"
        >
          {saveStatus === 'saving' && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {saveStatus === 'saved' && <HiCheckCircle size={18} />}
          {saveStatus === 'error' && <HiExclamationCircle size={18} />}
          Save
        </button>
      </div>
      
      {/* Sections */}
      <div className="space-y-4">
        <PlanCourseSection course={course} onUpdate={handleUpdate} />
        <CourseLandingPageSection course={course} onUpdate={handleUpdate} />
        
        {/* Course Structure Section - NEW */}
        <CourseStructureSection course={course} onUpdate={handleUpdate} />
        
        <PricingSection course={course} onUpdate={handleUpdate} />
        <PromotionsSection course={course} onUpdate={handleUpdate} />
        <CourseMessagesSection course={course} onUpdate={handleUpdate} />
      </div>
    </div>
  );
};

export default EditCourse;