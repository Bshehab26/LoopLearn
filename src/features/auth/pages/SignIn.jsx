// src/features/auth/pages/SignIn.jsx
import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../../layouts/AuthLayout';
import { useAuth } from '../../../store/AppProvider';
import { Login } from '../api/auth.api';
import { getUser } from '../../../services/utils/tokenUtils';
import { ErrorAlert, AuthInput, PasswordInput, AuthButton } from '../components/AuthComponents';

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

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ emailOrUsername: '', password: '' })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const errorRef = useRef(null);
  const inputRef = useRef(null);
  const from = location.state?.from?.pathname || null

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const clearError = useCallback(() => setError(''), []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    clearError();
  }, [clearError]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    clearError();

    if (!form.emailOrUsername.trim()) return setError('Email or username is required.');
    if (!form.password) return setError('Password is required.');

    setLoading(true);
    try {
      const result = await Login(form);
      if (!result.isAuthenticated) {
        setError(result.message || 'Login failed.');
        return;
      }
      
      login(result.token, result.expiresOn);
      
      // Wait for profile to be fetched
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const user = getUser();
      const role = user?.role;

      if (from) return navigate(from, { replace: true });
      if (role === 'Admin' || role === 'SuperAdmin') {
        navigate('/admin', { replace: true });
      } else if (role === 'Instructor') {
        navigate('/instructor', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.Message || 'Something went wrong.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [form, login, navigate, from, clearError]);

  return (
    <AuthLayout title='Welcome back 👋' subtitle='Sign in to continue learning' mode='signin'>
      <motion.form onSubmit={handleSubmit} className='flex flex-col gap-4' {...FORM_ANIMATION} noValidate>
        <div ref={errorRef}>
          <ErrorAlert error={error} onClose={clearError} />
        </div>

        <AuthInput
          ref={inputRef}
          name='emailOrUsername'
          type='text'
          placeholder='Username or Email'
          value={form.emailOrUsername}
          onChange={handleChange}
          disabled={loading}
          icon={<UserIcon />}
          autoComplete='username'
        />

        <PasswordInput
          name='password'
          placeholder='Password'
          value={form.password}
          onChange={handleChange}
          disabled={loading}
          autoComplete='current-password'
        />

        <div className='flex justify-end -mt-1'>
          <button type='button' onClick={() => {}} className='text-xs transition hover:opacity-70' style={{ color: '#534AB7' }}>
            Forgot password?
          </button>
        </div>

        <AuthButton loading={loading} loadingText='Signing in...'>Sign In</AuthButton>

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