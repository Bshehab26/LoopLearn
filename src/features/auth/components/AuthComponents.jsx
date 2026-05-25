// src/features/auth/components/AuthComponents.jsx
// Remove the ref forwarding issue

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiEye, HiEyeOff } from 'react-icons/hi';

// ============================================================================
// Error Alert Component
// ============================================================================

export const ErrorAlert = ({ error, onClose }) => (
  <AnimatePresence>
    {error && (
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        className='flex items-start gap-3 px-4 py-3 rounded-xl text-sm mb-4'
        style={{ background: '#FEF2F2', border: '0.5px solid #FCA5A5', color: '#991B1B' }}
        role='alert'
      >
        <div className='flex-shrink-0 mt-0.5'>
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <circle cx='12' cy='12' r='10' />
            <line x1='12' y1='8' x2='12' y2='12' />
            <line x1='12' y1='16' x2='12.01' y2='16' />
          </svg>
        </div>
        <p className='flex-1 leading-relaxed font-medium'>{error}</p>
        {onClose && (
          <button
            type='button'
            onClick={onClose}
            className='flex-shrink-0 opacity-60 hover:opacity-100 transition'
            aria-label='Close error'
          >
            <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>
        )}
      </motion.div>
    )}
  </AnimatePresence>
);

// ============================================================================
// Input Field Component (No ref - remove ref forwarding)
// ============================================================================

export const AuthInput = ({ 
  name, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  disabled, 
  icon, 
  autoComplete 
}) => {
  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    paddingLeft: icon ? 38 : 14,
    borderRadius: 10,
    fontSize: 14,
    outline: 'none',
    border: '0.5px solid rgba(0,0,0,0.12)',
    background: disabled ? '#FAFAFA' : 'white',
    color: '#2C2C2A',
    transition: 'border 0.15s, box-shadow 0.15s',
  };

  const handleFocus = (e) => {
    e.target.style.border = '1px solid #534AB7';
    e.target.style.boxShadow = '0 0 0 3px #EEEDFE';
  };

  const handleBlur = (e) => {
    e.target.style.border = '0.5px solid rgba(0,0,0,0.12)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className='relative'>
      {icon && (
        <div className='absolute left-3 top-1/2 -translate-y-1/2' style={{ color: '#B4B2A9', zIndex: 1 }}>
          {icon}
        </div>
      )}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        style={inputStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className='w-full'
      />
    </div>
  );
};

// ============================================================================
// Password Input Component - Fixed
// ============================================================================

export const PasswordInput = ({ name, placeholder, value, onChange, disabled, autoComplete }) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    paddingLeft: 38,
    paddingRight: 44,
    borderRadius: 10,
    fontSize: 14,
    outline: 'none',
    border: '0.5px solid rgba(0,0,0,0.12)',
    background: disabled ? '#FAFAFA' : 'white',
    color: '#2C2C2A',
    transition: 'border 0.15s, box-shadow 0.15s',
  };

  const handleFocus = (e) => {
    e.target.style.border = '1px solid #534AB7';
    e.target.style.boxShadow = '0 0 0 3px #EEEDFE';
  };

  const handleBlur = (e) => {
    e.target.style.border = '0.5px solid rgba(0,0,0,0.12)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className='relative'>
      <div className='absolute left-3 top-1/2 -translate-y-1/2' style={{ color: '#B4B2A9', zIndex: 1 }}>
        <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <rect x='3' y='11' width='18' height='11' rx='2' />
          <path d='M7 11V7a5 5 0 0 1 10 0v4' />
        </svg>
      </div>

      <input
        name={name}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        style={inputStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className='w-full'
      />

      <button
        type='button'
        onClick={() => setShowPassword(!showPassword)}
        className='absolute right-3 top-1/2 -translate-y-1/2 transition hover:opacity-70 focus:outline-none'
        style={{ color: '#B4B2A9', zIndex: 1, background: 'transparent', cursor: 'pointer' }}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <HiEyeOff size={16} /> : <HiEye size={16} />}
      </button>
    </div>
  );
};

// ============================================================================
// Submit Button Component
// ============================================================================

export const AuthButton = ({ loading, children, loadingText }) => (
  <button
    type='submit'
    disabled={loading}
    className='w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 hover:opacity-90 hover:shadow-md active:scale-[0.98]'
    style={{ background: 'linear-gradient(135deg, #534AB7 0%, #3C3489 100%)' }}
  >
    {loading ? (
      <span className='flex items-center justify-center gap-2'>
        <svg className='animate-spin' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <path d='M21 12a9 9 0 1 1-6.219-8.56' />
        </svg>
        {loadingText || 'Loading...'}
      </span>
    ) : (
      children
    )}
  </button>
);

// ============================================================================
// Select Input Component
// ============================================================================

export const AuthSelect = ({ name, value, onChange, disabled, children }) => {
  const selectStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    fontSize: 14,
    outline: 'none',
    border: '0.5px solid rgba(0,0,0,0.12)',
    background: 'white',
    color: value ? '#2C2C2A' : '#B4B2A9',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23B4B2A9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
    backgroundPosition: 'right 12px center',
    backgroundSize: '20px',
    backgroundRepeat: 'no-repeat',
    transition: 'border 0.15s, box-shadow 0.15s',
  };

  const handleFocus = (e) => {
    e.target.style.border = '1px solid #534AB7';
    e.target.style.boxShadow = '0 0 0 3px #EEEDFE';
  };

  const handleBlur = (e) => {
    e.target.style.border = '0.5px solid rgba(0,0,0,0.12)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={selectStyle}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className='w-full'
    >
      {children}
    </select>
  );
};