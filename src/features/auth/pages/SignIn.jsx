// src/features/auth/pages/SignIn.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AuthLayout from '../../../layouts/AuthLayout';
import useAuth from '../hooks/useAuth';
import { ErrorAlert, AuthInput, PasswordInput, AuthButton } from '../components/AuthComponents';

// ============================================================================
// Constants
// ============================================================================

const FORM_ANIMATION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const UserIcon = () => (
  <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
    <circle cx='12' cy='7' r='4' />
  </svg>
);

// ============================================================================
// Main Component
// ============================================================================

const SignIn = () => {
  const { signIn, loading, error, clearError } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  const errorRef = useRef(null);
  const identifierInputRef = useRef(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  useEffect(() => {
    identifierInputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    await signIn({ identifier: identifier.trim(), password: password.trim() });
  }, [identifier, password, signIn]);

  const handleForgotPassword = useCallback(() => {
    // TODO: Implement forgot password
    console.log('Forgot password clicked');
  }, []);

  return (
    <AuthLayout title='Welcome back 👋' subtitle='Sign in to continue learning' mode='signin'>
      <motion.form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
        {...FORM_ANIMATION}
        noValidate
      >
        <div ref={errorRef}>
          <ErrorAlert error={error} onClose={clearError} />
        </div>

        <AuthInput
          ref={identifierInputRef}
          name='identifier'
          type='text'
          placeholder='Username or Email'
          value={identifier}
          onChange={(e) => { setIdentifier(e.target.value); clearError(); }}
          disabled={loading}
          icon={<UserIcon />}
          autoComplete='username'
        />

        <PasswordInput
          name='password'
          placeholder='Password'
          value={password}
          onChange={(e) => { setPassword(e.target.value); clearError(); }}
          disabled={loading}
          autoComplete='current-password'
        />

        <div className='flex justify-end -mt-1'>
          <button
            type='button'
            onClick={handleForgotPassword}
            className='text-xs transition hover:opacity-70 focus:outline-none focus:underline'
            style={{ color: '#534AB7' }}
          >
            Forgot password?
          </button>
        </div>

        <AuthButton loading={loading} loadingText='Signing in...'>
          Sign In
        </AuthButton>

        <p className='text-sm text-center text-gray-500 pt-1'>
          Don't have an account?{' '}
          <Link to='/signup' className='font-medium hover:underline transition' style={{ color: '#534AB7' }}>
            Sign Up
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
};

export default SignIn;