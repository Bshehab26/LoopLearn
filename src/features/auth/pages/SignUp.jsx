// src/features/auth/pages/SignUp.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../layouts/AuthLayout';
import { useAuth } from '../../../store/AppProvider';
import { Register } from '../api/auth.api';
import { ErrorAlert, AuthInput, PasswordInput, AuthButton } from '../components/AuthComponents';
import { HiCalendar, HiUserGroup } from 'react-icons/hi';

// ============================================================================
// Constants
// ============================================================================

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
];

const FORM_ANIMATION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
};

const sanitizePhoneNumber = (value) => value.replace(/\D/g, '');

// ============================================================================
// Sub‑components
// ============================================================================

const UserIcon = () => (
  <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
    <circle cx='12' cy='7' r='4' />
  </svg>
);

const PhoneIcon = () => (
  <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 5.5 5.5l.91-.91a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7a2 2 0 0 1 1.76 2.17z' />
  </svg>
);

const EmailIcon = () => (
  <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
    <polyline points='22,6 12,13 2,6' />
  </svg>
);

const CheckIcon = () => (
  <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
    <polyline points='20 6 9 17 4 12' />
  </svg>
);

const XIcon = () => (
  <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
    <line x1='18' y1='6' x2='6' y2='18' />
    <line x1='6' y1='6' x2='18' y2='18' />
  </svg>
);

const PasswordMatchIndicator = ({ password, confirmPassword }) => {
  if (!password || !confirmPassword) return null;
  const doMatch = password === confirmPassword;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className='flex items-center gap-2 text-xs px-1'
      style={{ color: doMatch ? '#065F46' : '#991B1B' }}
    >
      {doMatch ? <><CheckIcon /> Passwords match</> : <><XIcon /> Passwords don't match</>}
    </motion.div>
  );
};

const GenderSelect = ({ value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = GENDER_OPTIONS.find(opt => opt.value === value);

  return (
    <div className='relative' ref={selectRef}>
      <button
        type='button'
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className='w-full flex items-center gap-3 text-sm outline-none transition-all disabled:opacity-50'
        style={{
          padding: '11px 14px',
          borderRadius: 10,
          border: '0.5px solid rgba(0,0,0,0.12)',
          background: disabled ? '#FAFAFA' : 'white',
          color: value ? '#2C2C2A' : '#B4B2A9',
        }}
        disabled={disabled}
      >
        <HiUserGroup size={15} style={{ color: '#B4B2A9' }} />
        <span className='flex-1 text-left'>{selectedOption ? selectedOption.label : 'Select Gender'}</span>
        <svg
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          width='14'
          height='14'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <polyline points='6 9 12 15 18 9' />
        </svg>
      </button>

      {isOpen && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className='absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'
        >
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type='button'
              onClick={() => {
                onChange({ target: { name: 'gender', value: option.value } });
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition hover:bg-purple-50 ${
                value === option.value ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700'
              }`}
            >
              {option.label}
              {value === option.value && <CheckIcon />}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const INITIAL = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  birthDate: '',
  gender: '',
};

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(INITIAL);
  const errorRef = useRef(null);
  const firstInputRef = useRef(null);

  // Scroll error into view
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  // Focus first input on mount
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const clearError = useCallback(() => setError(''), []);

  const handleChange = useCallback((e) => {
    if (loading) return;
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    clearError();
  }, [loading, clearError]);

  const handlePhoneChange = useCallback((e) => {
    if (loading) return;
    setForm(prev => ({ ...prev, phone: sanitizePhoneNumber(e.target.value) }));
    clearError();
  }, [loading, clearError]);

  const validate = () => {
    if (!form.firstName.trim()) return 'First name is required.';
    if (!form.lastName.trim()) return 'Last name is required.';
    if (!form.username.trim()) return 'Username is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email address.';
    if (!form.password) return 'Password is required.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    if (!form.phone.trim()) return 'Phone is required.';
    if (!/^01[0125]\d{8}$/.test(form.phone)) return 'Enter a valid Egyptian phone number (e.g. 01012345678).';
    if (!form.birthDate) return 'Birth date is required.';
    if (!form.gender) return 'Please select a gender.';
    return null;
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    clearError();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fName: form.firstName,
        lName: form.lastName,
        username: form.username,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        phone: form.phone,
        birthDate: new Date(form.birthDate).toISOString(),
        gender: form.gender,
      };

      const result = await Register(payload);

      if (!result.isAuthenticated) {
        setError(result.message || 'Registration failed.');
        return;
      }

      login(result.token, result.expiresOn);
      navigate('/', { replace: true });
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        data?.message ||
        data?.Message ||
        (typeof data === 'string' ? data : null) ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [form, login, navigate, clearError]);

  return (
    <AuthLayout title='Create account ✨' subtitle='Join and start learning today' mode='signup'>
      {/* ❌ Back to Home button removed - now handled by AuthLayout */}
      
      <motion.form
        onSubmit={handleSubmit}
        className='flex flex-col gap-3'
        {...FORM_ANIMATION}
        noValidate
      >
        <div ref={errorRef}>
          <ErrorAlert error={error} onClose={clearError} />
        </div>

        <AuthInput
          ref={firstInputRef}
          name='username'
          placeholder='Username'
          value={form.username}
          onChange={handleChange}
          disabled={loading}
          icon={<UserIcon />}
          autoComplete='username'
        />

        <div className='grid grid-cols-2 gap-3'>
          <AuthInput
            name='firstName'
            placeholder='First Name'
            value={form.firstName}
            onChange={handleChange}
            disabled={loading}
            autoComplete='given-name'
          />
          <AuthInput
            name='lastName'
            placeholder='Last Name'
            value={form.lastName}
            onChange={handleChange}
            disabled={loading}
            autoComplete='family-name'
          />
        </div>

        <AuthInput
          name='phone'
          type='tel'
          placeholder='01XXXXXXXXX'
          value={form.phone}
          onChange={handlePhoneChange}
          disabled={loading}
          icon={<PhoneIcon />}
          autoComplete='tel'
        />

        <AuthInput
          name='email'
          type='email'
          placeholder='Email address'
          value={form.email}
          onChange={handleChange}
          disabled={loading}
          icon={<EmailIcon />}
          autoComplete='email'
        />

        <div className='grid grid-cols-2 gap-3'>
          <GenderSelect value={form.gender} onChange={handleChange} disabled={loading} />
          <AuthInput
            name='birthDate'
            type='date'
            placeholder='Birth Date'
            value={form.birthDate}
            onChange={handleChange}
            disabled={loading}
            icon={<HiCalendar size={15} />}
          />
        </div>

        <PasswordInput
          name='password'
          placeholder='Password (min. 8 characters)'
          value={form.password}
          onChange={handleChange}
          disabled={loading}
          autoComplete='new-password'
        />
        <PasswordInput
          name='confirmPassword'
          placeholder='Confirm Password'
          value={form.confirmPassword}
          onChange={handleChange}
          disabled={loading}
          autoComplete='new-password'
        />

        <PasswordMatchIndicator password={form.password} confirmPassword={form.confirmPassword} />

        <AuthButton loading={loading} loadingText='Creating account...'>
          Create Account
        </AuthButton>

        <p className='text-sm text-center text-gray-500 pt-1'>
          Already have an account?{' '}
          <Link to='/signin' className='font-medium hover:underline transition' style={{ color: '#534AB7' }}>
            Sign In
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
};

export default SignUp;