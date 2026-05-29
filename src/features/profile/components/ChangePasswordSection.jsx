// src/features/profile/components/ChangePasswordSection.jsx
import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPencil, HiCheck, HiX, HiEye, HiEyeOff, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

const MIN_PASSWORD_LENGTH = 8;

const PasswordInput = ({ name, placeholder, value, onChange, show, onToggle, error, autoFocus = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <div className={`relative transition-all duration-150 ${isFocused ? 'ring-2 ring-purple-100' : ''}`}>
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none transition-all pr-10 ${
            error ? 'border-red-500' : 'border-gray-200 focus:border-purple-400'
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          tabIndex={-1}
        >
          {show ? <HiEyeOff size={16} /> : <HiEye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(4, Math.ceil(score / 1.25));
  };

  const strength = calculateStrength(password);
  const getStrengthInfo = () => {
    const configs = [
      { label: 'Weak', color: '#E24B4A', width: '25%' },
      { label: 'Fair', color: '#EF9F27', width: '50%' },
      { label: 'Good', color: '#1D9E75', width: '75%' },
      { label: 'Strong', color: '#534AB7', width: '100%' },
    ];
    return strength > 0 ? configs[strength - 1] : null;
  };

  const strengthInfo = getStrengthInfo();

  if (!password || strength === 0) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">Password strength</span>
        <span className="text-xs font-medium" style={{ color: strengthInfo?.color }}>
          {strengthInfo?.label}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-300" 
          style={{ width: strengthInfo?.width, backgroundColor: strengthInfo?.color }} 
        />
      </div>
    </div>
  );
};

const ChangePasswordSection = ({ onChangePassword, saving = false }) => {
  const [isEditing, setIsEditing] = useState(false);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const oldPasswordRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => oldPasswordRef.current?.focus(), 100);
    }
  }, [isEditing]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const toggleShow = useCallback((field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.oldPassword) newErrors.oldPassword = 'Current password is required';
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    if (formData.newPassword.length < MIN_PASSWORD_LENGTH) {
      newErrors.newPassword = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.oldPassword && formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const success = await onChangePassword(formData);
    setIsSubmitting(false);
    
    if (success) {
      setSuccessMessage('Password changed successfully!');
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
    setShowPasswords({ old: false, new: false, confirm: false });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // View Mode
  if (!isEditing) {
    return (
      <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-800">Password & Security</h3>
            <p className="text-xs text-gray-400 mt-0.5">Update your account password</p>
          </div>
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-purple-50"
            style={{ border: '0.5px solid #534AB7', color: '#534AB7' }}
          >
            <HiPencil size={13} /> Change
          </button>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-lg">
              🔒
            </div>
            <div>
              <p className="text-xs text-gray-400">Password</p>
              <p className="text-sm font-medium text-gray-800">••••••••</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode
  return (
    <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm">
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2"
          >
            <HiCheckCircle size={16} />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Change Password</h3>
          <p className="text-xs text-gray-400 mt-0.5">Enter your new password</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Current Password *</label>
          <PasswordInput
            name="oldPassword"
            placeholder="Enter current password"
            value={formData.oldPassword}
            onChange={handleChange}
            show={showPasswords.old}
            onToggle={() => toggleShow('old')}
            error={errors.oldPassword}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">New Password *</label>
          <PasswordInput
            name="newPassword"
            placeholder="Enter new password (min. 8 characters)"
            value={formData.newPassword}
            onChange={handleChange}
            show={showPasswords.new}
            onToggle={() => toggleShow('new')}
            error={errors.newPassword}
          />
          <PasswordStrengthIndicator password={formData.newPassword} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Confirm New Password *</label>
          <PasswordInput
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            show={showPasswords.confirm}
            onToggle={() => toggleShow('confirm')}
            error={errors.confirmPassword}
          />
          {formData.confirmPassword && (
            <p className={`text-xs mt-1 flex items-center gap-1 ${formData.newPassword === formData.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
              {formData.newPassword === formData.confirmPassword ? (
                <><HiCheckCircle size={12} /> Passwords match</>
              ) : (
                <><HiExclamationCircle size={12} /> Passwords do not match</>
              )}
            </p>
          )}
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-600 mb-2">Password requirements:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
              At least 8 characters
            </li>
            <li className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.newPassword) && /[a-z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
              Uppercase and lowercase letters
            </li>
            <li className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
              At least one number
            </li>
          </ul>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting || saving}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg transition disabled:opacity-50"
          >
            {isSubmitting || saving ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordSection;