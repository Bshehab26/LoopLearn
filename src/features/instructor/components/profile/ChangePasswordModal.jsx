/**
 * ChangePasswordModal.jsx
 * Modal component for changing user password with password strength indicator.
 * Features password visibility toggle, strength meter, and confirmation validation.
 * 
 * @module features/student/components/profile/ChangePasswordModal
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiEye, HiEyeOff, HiX, HiLockClosed, HiCheckCircle, 
  HiExclamationCircle, HiShieldCheck
} from 'react-icons/hi';

// ============================================================================
// Constants
// ============================================================================

/** Password strength configuration */
const STRENGTH_CONFIG = [
  { label: 'Weak', color: '#E24B4A', bgColor: '#FCEBEB', icon: HiExclamationCircle, minScore: 0, maxScore: 1 },
  { label: 'Fair', color: '#EF9F27', bgColor: '#FEF3C7', icon: HiExclamationCircle, minScore: 2, maxScore: 2 },
  { label: 'Good', color: '#1D9E75', bgColor: '#D1FAE5', icon: HiCheckCircle, minScore: 3, maxScore: 3 },
  { label: 'Strong', color: '#534AB7', bgColor: '#EEEDFE', icon: HiShieldCheck, minScore: 4, maxScore: 5 },
];

/** Minimum password length requirements */
const MIN_PASSWORD_LENGTH = 8;

/** Maximum password length */
const MAX_PASSWORD_LENGTH = 100;

/** Animation variants */
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculates password strength score (0-4)
 * @param {string} password - The password to evaluate
 * @returns {number} Strength score (0-4)
 */
const calculatePasswordStrength = (password) => {
  if (!password) return 0;
  
  let score = 0;
  
  // Length checks
  if (password.length >= MIN_PASSWORD_LENGTH) score++;
  if (password.length >= 12) score++;
  
  // Character variety checks
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  // Normalize to 0-4 range
  return Math.min(4, Math.ceil(score / 1.25));
};

/**
 * Gets password strength info based on score
 * @param {number} score - Password strength score
 * @returns {Object|null} Strength config object
 */
const getStrengthInfo = (score) => {
  if (score === 0) return null;
  return STRENGTH_CONFIG.find(config => 
    score >= config.minScore && score <= config.maxScore
  ) || STRENGTH_CONFIG[0];
};

/**
 * Validates password requirements
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  
  if (password.length > MAX_PASSWORD_LENGTH) {
    errors.push(`Password must be less than ${MAX_PASSWORD_LENGTH} characters`);
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// Subcomponents
// ============================================================================

/**
 * Password input field with visibility toggle
 */
const PasswordInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  show, 
  onToggle, 
  hint,
  error,
  autoFocus = false,
}) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className='flex flex-col gap-1.5'>
      <label className='text-xs font-semibold uppercase tracking-wider text-gray-500'>
        {label}
      </label>
      <div
        className={`flex items-center gap-2 px-3 rounded-xl transition-all duration-200 ${
          isFocused ? 'ring-2 ring-purple-100' : ''
        } ${error ? 'border-red-500' : 'border-purple-200'}`}
        style={{ border: '1px solid', background: '#FAFAFE', height: '48px' }}
      >
        <HiLockClosed size={14} className={`${error ? 'text-red-400' : 'text-gray-400'}`} />
        <input
          ref={inputRef}
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={hint}
          className='flex-1 bg-transparent outline-none text-sm text-gray-700'
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={label}
        />
        <button
          type='button'
          onClick={onToggle}
          className='flex-shrink-0 transition hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-full p-1'
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <HiEyeOff size={16} /> : <HiEye size={16} />}
        </button>
      </div>
      {error && (
        <p className='text-xs text-red-500 mt-0.5'>{error}</p>
      )}
    </div>
  );
};

/**
 * Password strength indicator component
 */
const PasswordStrengthIndicator = ({ password }) => {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);
  const strengthInfo = useMemo(() => getStrengthInfo(strength), [strength]);

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className='flex flex-col gap-2 -mt-1'
    >
      <div className='flex gap-1'>
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.05 }}
            className='flex-1 h-1.5 rounded-full transition-all duration-300'
            style={{ 
              background: i <= strength ? strengthInfo?.color : '#F1EFE8',
            }}
          />
        ))}
      </div>
      <div className='flex items-center justify-between'>
        <p className='text-xs font-medium' style={{ color: strengthInfo?.color }}>
          {strengthInfo?.label} password
        </p>
        {strengthInfo && (
          <strengthInfo.icon size={12} style={{ color: strengthInfo.color }} />
        )}
      </div>
    </motion.div>
  );
};

/**
 * Password match indicator component
 */
const PasswordMatchIndicator = ({ password, confirmPassword }) => {
  if (!password || !confirmPassword) return null;
  
  const doMatch = password === confirmPassword;
  
  return (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className='text-xs font-medium flex items-center gap-1.5'
      style={{ color: doMatch ? '#1D9E75' : '#E24B4A' }}
    >
      {doMatch ? (
        <HiCheckCircle size={12} />
      ) : (
        <HiExclamationCircle size={12} />
      )}
      {doMatch ? 'Passwords match' : 'Passwords do not match'}
    </motion.p>
  );
};

/**
 * Requirements list component
 */
const RequirementsList = ({ password }) => {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'At least one lowercase letter', met: /[a-z]/.test(password) },
    { label: 'At least one number', met: /[0-9]/.test(password) },
    { label: 'At least one special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className='flex flex-wrap gap-2 mt-1'
    >
      {requirements.map((req, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
            req.met ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {req.met ? <HiCheckCircle size={10} /> : <HiExclamationCircle size={10} />}
          {req.label}
        </div>
      ))}
    </motion.div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * ChangePasswordModal - Modal for changing user password
 * @param {Object} props
 * @param {Function} props.onClose - Close modal handler
 * @param {Function} props.onSubmit - Submit password change handler
 * @param {boolean} props.loading - Loading state
 */
const ChangePasswordModal = ({ onClose, onSubmit, loading = false }) => {
  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // --------------------------------------------------------------------------
  // Derived Values
  // --------------------------------------------------------------------------
  const isFormValid = useMemo(() => {
    return (
      formData.oldPassword &&
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword === formData.confirmPassword &&
      validatePassword(formData.newPassword).isValid
    );
  }, [formData]);

  // --------------------------------------------------------------------------
  // Validation
  // --------------------------------------------------------------------------
  const validateField = useCallback((field, value) => {
    switch (field) {
      case 'oldPassword':
        if (!value) return 'Current password is required';
        return '';
      case 'newPassword':
        if (!value) return 'New password is required';
        const validation = validatePassword(value);
        if (!validation.isValid) return validation.errors[0];
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.newPassword) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  }, [formData.newPassword]);

  // Validate all fields
  useEffect(() => {
    const newErrors = {};
    if (touched.oldPassword) newErrors.oldPassword = validateField('oldPassword', formData.oldPassword);
    if (touched.newPassword) newErrors.newPassword = validateField('newPassword', formData.newPassword);
    if (touched.confirmPassword) newErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);
    setErrors(newErrors);
  }, [formData, touched, validateField]);

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------
  
  const togglePasswordVisibility = useCallback((field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      oldPassword: true,
      newPassword: true,
      confirmPassword: true,
    });
    
    // Validate all fields
    const newErrors = {
      oldPassword: validateField('oldPassword', formData.oldPassword),
      newPassword: validateField('newPassword', formData.newPassword),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
    };
    
    if (Object.values(newErrors).some(err => err)) {
      setErrors(newErrors);
      return;
    }
    
    const result = await onSubmit({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });
    
    if (result !== false) {
      // Reset form on success
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTouched({});
      onClose();
    }
  }, [formData, onSubmit, validateField, onClose]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  
  return (
    <AnimatePresence>
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className='fixed inset-0 z-50 flex items-center justify-center px-4'
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={handleOverlayClick}
        role='dialog'
        aria-modal='true'
        aria-labelledby='change-password-title'
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className='w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-2xl'
        >
          {/* Top accent bar */}
          <div className='h-1 w-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600' />

          <div className='p-6'>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center'>
                  <HiLockClosed size={18} className='text-purple-600' />
                </div>
                <div>
                  <h3 id='change-password-title' className='text-lg font-semibold text-gray-800'>Change Password</h3>
                  <p className='text-xs text-gray-500 mt-0.5'>Keep your account secure</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className='w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400'
                aria-label='Close modal'
              >
                <HiX size={18} className='text-gray-500' />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
              {/* Current Password */}
              <PasswordInput
                label='Current Password'
                name='oldPassword'
                value={formData.oldPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                show={showPasswords.old}
                onToggle={() => togglePasswordVisibility('old')}
                hint='Enter your current password'
                error={errors.oldPassword}
              />

              {/* New Password */}
              <PasswordInput
                label='New Password'
                name='newPassword'
                value={formData.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                show={showPasswords.new}
                onToggle={() => togglePasswordVisibility('new')}
                hint={`Minimum ${MIN_PASSWORD_LENGTH} characters`}
                error={errors.newPassword}
                autoFocus
              />

              {/* Password Strength Indicator */}
              <PasswordStrengthIndicator password={formData.newPassword} />

              {/* Requirements List */}
              <RequirementsList password={formData.newPassword} />

              {/* Confirm Password */}
              <PasswordInput
                label='Confirm New Password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                show={showPasswords.confirm}
                onToggle={() => togglePasswordVisibility('confirm')}
                hint='Re-enter your new password'
                error={errors.confirmPassword}
              />

              {/* Password Match Indicator */}
              <PasswordMatchIndicator 
                password={formData.newPassword} 
                confirmPassword={formData.confirmPassword} 
              />

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading || !isFormValid}
                className='w-full py-3 rounded-xl text-sm font-semibold text-white mt-2 transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
                style={{ background: 'linear-gradient(135deg, #534AB7 0%, #7B74D4 100%)' }}
              >
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Updating...
                  </span>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChangePasswordModal;