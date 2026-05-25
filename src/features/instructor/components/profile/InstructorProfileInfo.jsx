/**
 * ProfileInfo.jsx
 * Component for displaying and editing student profile information.
 * Includes personal details fields and statistics cards with animations.
 * 
 * @module features/student/components/profile/ProfileInfo
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiPencil, HiCheck, HiX, HiAcademicCap, HiStar, HiDocumentText,
  HiOutlineMail, HiOutlinePhone, HiOutlineUser, HiOutlineCalendar
} from 'react-icons/hi';

// ============================================================================
// Constants
// ============================================================================

/** Field configurations for student profile */
const PROFILE_FIELDS = [
  { 
    name: 'fName', 
    label: 'First Name', 
    type: 'text', 
    placeholder: 'Enter your first name',
    icon: HiOutlineUser
  },
  { 
    name: 'lName', 
    label: 'Last Name', 
    type: 'text', 
    placeholder: 'Enter your last name',
    icon: HiOutlineUser
  },
  { 
    name: 'email', 
    label: 'Email Address', 
    type: 'email', 
    placeholder: 'Enter your email address',
    icon: HiOutlineMail
  },
  { 
    name: 'phone', 
    label: 'Phone Number', 
    type: 'tel', 
    placeholder: 'Enter your phone number',
    icon: HiOutlinePhone
  },
];

/** Statistics card configuration */
const STATS_CONFIG = [
  { 
    icon: HiAcademicCap, 
    label: 'Enrolled', 
    color: '#534AB7', 
    bgColor: '#EEEDFE',
    gradient: 'from-purple-600 to-indigo-600',
    getValue: (user) => user?.enrolledCourses || 0,
    tooltip: 'Number of courses you are enrolled in'
  },
  { 
    icon: HiStar, 
    label: 'Completed', 
    color: '#1D9E75', 
    bgColor: '#D1FAE5',
    gradient: 'from-green-600 to-emerald-600',
    getValue: (user) => user?.completedCourses || 0,
    tooltip: 'Number of courses you have completed'
  },
  { 
    icon: HiDocumentText, 
    label: 'Certificates', 
    color: '#B45309', 
    bgColor: '#FEF3C7',
    gradient: 'from-amber-600 to-orange-600',
    getValue: (user) => user?.certificates || 0,
    tooltip: 'Number of certificates earned'
  },
];

/** Default form values */
const DEFAULT_FORM = {
  fName: '',
  lName: '',
  phone: '',
  email: '',
};

/** Animation variants */
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Field component for displaying and editing a single profile field
 */
const Field = ({ label, name, value, type = 'text', editing, onChange, placeholder, icon: Icon, error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const displayValue = editing ? value : value || 'Not provided';

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    paddingLeft: Icon ? '40px' : '16px',
    borderRadius: 12,
    fontSize: 14,
    outline: 'none',
    border: error ? '1px solid #EF4444' : '1px solid rgba(83,74,183,0.35)',
    background: '#FAFAFE',
    color: '#2C2C2A',
    transition: 'all 0.2s ease',
  };

  const readStyle = {
    padding: '12px 0',
    fontWeight: 500,
    color: value ? '#2C2C2A' : '#C4C2BA',
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    e.target.style.border = '1px solid #534AB7';
    e.target.style.boxShadow = '0 0 0 3px rgba(83,74,183,0.1)';
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    e.target.style.border = error ? '1px solid #EF4444' : '1px solid rgba(83,74,183,0.35)';
    e.target.style.boxShadow = 'none';
  };

  if (!editing) {
    return (
      <div className='flex flex-col gap-1.5'>
        <label className='text-xs font-semibold uppercase tracking-wider text-gray-500'>
          {label}
        </label>
        <p className='text-sm font-medium' style={{ color: value ? '#2C2C2A' : '#C4C2BA' }}>
          {displayValue}
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-1.5'>
      <label className='text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1'>
        {label}
      </label>
      <div className='relative'>
        {Icon && (
          <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
            <Icon className='w-4 h-4' />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`transition-all ${isFocused ? 'ring-2 ring-purple-100' : ''}`}
        />
      </div>
      {error && (
        <p className='text-xs text-red-500 mt-0.5'>{error}</p>
      )}
    </div>
  );
};

/**
 * StatCard component for displaying student statistics
 */
const StatCard = ({ icon: Icon, value, label, color, bgColor, gradient, delay = 0, tooltip }) => (
  <motion.div
    variants={statVariants}
    transition={{ delay }}
    whileHover={{ y: -4 }}
    className='group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-help'
    title={tooltip}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    <div className='relative p-5 text-center'>
      <div 
        className='w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110'
        style={{ background: `${color}15` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <p className='text-2xl font-bold' style={{ color }}>{value ?? 0}</p>
      <p className='text-xs font-medium text-gray-500 mt-1'>{label}</p>
    </div>
  </motion.div>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * ProfileInfo - Displays and edits student profile information
 * @param {Object} props
 * @param {Object} props.user - User profile data
 * @param {Function} props.onSave - Save handler function
 * @param {boolean} props.loading - Loading state
 */
const ProfileInfo = ({ user, onSave, loading = false }) => {
  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // --------------------------------------------------------------------------
  // Derived Values
  // --------------------------------------------------------------------------
  
  /**
   * Normalizes user data to form format
   */
  const normalizeUserData = useCallback((userData) => ({
    fName: userData?.firstName || userData?.fName || '',
    lName: userData?.lastName || userData?.lName || '',
    phone: userData?.phone || '',
    email: userData?.email || '',
  }), []);

  /**
   * Gets display value for a field (handles both editing and view modes)
   */
  const getDisplayValue = useCallback((field) => {
    if (isEditing) return formData[field];
    switch (field) {
      case 'fName': return user?.firstName || user?.fName;
      case 'lName': return user?.lastName || user?.lName;
      default: return user?.[field];
    }
  }, [isEditing, formData, user]);

  /**
   * Validates form fields
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (isEditing) {
      if (!formData.fName?.trim()) newErrors.fName = 'First name is required';
      if (!formData.lName?.trim()) newErrors.lName = 'Last name is required';
      if (!formData.email?.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number format';
      }
    }
    return newErrors;
  }, [formData, isEditing]);

  /**
   * Statistics data with computed values
   */
  const stats = useMemo(() => 
    STATS_CONFIG.map(stat => ({
      ...stat,
      value: stat.getValue(user),
    })), [user]
  );

  // --------------------------------------------------------------------------
  // Effects
  // --------------------------------------------------------------------------
  
  /**
   * Initialize form with user data when user changes
   */
  useEffect(() => {
    setFormData(normalizeUserData(user));
    setErrors({});
    setTouched({});
  }, [user, normalizeUserData]);

  /**
   * Validate on form changes
   */
  useEffect(() => {
    if (isEditing && Object.keys(touched).length > 0) {
      const newErrors = validateForm();
      setErrors(newErrors);
    }
  }, [formData, isEditing, touched, validateForm]);

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------
  
  /**
   * Handles input field changes
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  /**
   * Handles field blur for validation
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  /**
   * Saves the edited profile data
   */
  const handleSave = useCallback(async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    await onSave(formData);
    setIsEditing(false);
    setErrors({});
    setTouched({});
  }, [formData, onSave, validateForm]);

  /**
   * Cancels editing and resets form
   */
  const handleCancel = useCallback(() => {
    setFormData(normalizeUserData(user));
    setIsEditing(false);
    setErrors({});
    setTouched({});
  }, [user, normalizeUserData]);

  /**
   * Enables edit mode
   */
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setFormData(normalizeUserData(user));
  }, [user, normalizeUserData]);

  // Check if form has changes
  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(normalizeUserData(user));
  }, [formData, user, normalizeUserData]);

  const isSaveDisabled = loading || !hasChanges || Object.keys(errors).length > 0;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className='rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden'
    >
      {/* Header */}
      <div className='flex items-center justify-between p-6 border-b border-gray-100'>
        <div>
          <h3 className='text-base font-semibold text-gray-800'>Personal Information</h3>
          <p className='text-xs text-gray-500 mt-0.5'>
            {isEditing ? 'Make your changes below' : 'Your account details'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-2'>
          <AnimatePresence mode='wait'>
            {isEditing ? (
              <motion.div
                key="edit-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className='flex items-center gap-2'
              >
                <button
                  onClick={handleCancel}
                  className='flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-200 hover:bg-gray-100 active:scale-95'
                  style={{ border: '0.5px solid rgba(0,0,0,0.12)', color: '#888780' }}
                >
                  <HiX size={13} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaveDisabled}
                  className='flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm text-white font-medium transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                  style={{ background: 'linear-gradient(135deg, #534AB7 0%, #7B74D4 100%)' }}
                >
                  <HiCheck size={13} />
                  {loading ? 'Saving…' : 'Save'}
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="view-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={handleEdit}
                className='flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-purple-50 active:scale-95'
                style={{ border: '0.5px solid #534AB7', color: '#534AB7' }}
              >
                <HiPencil size={13} /> Edit
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className='p-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          {PROFILE_FIELDS.map((field) => (
            <Field
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              value={getDisplayValue(field.name)}
              editing={isEditing}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={field.placeholder}
              icon={field.icon}
              error={touched[field.name] && errors[field.name]}
            />
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-3 gap-4 p-6 pt-0'>
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            color={stat.color}
            bgColor={stat.bgColor}
            gradient={stat.gradient}
            delay={index * 0.05}
            tooltip={stat.tooltip}
          />
        ))}
      </div>

      {/* Last updated info (optional) */}
      {user?.updatedAt && !isEditing && (
        <div className='px-6 pb-6'>
          <p className='text-xs text-gray-400 flex items-center gap-1'>
            <HiOutlineCalendar size={12} />
            Last updated: {new Date(user.updatedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileInfo;